import type Docker from "dockerode";
import type * as TDocker from "docker-api-ts";
import type { MachineResources } from "@trigger.dev/core/v3";
import { SimpleStructuredLogger } from "@trigger.dev/core/v3/utils/structuredLogger";
import { env } from "./env.js";

const logger = new SimpleStructuredLogger("resource-monitor");

interface NodeResources {
  cpuTotal: number; // in cores
  cpuAvailable: number;
  memoryTotal: number; // in bytes
  memoryAvailable: number;
}

interface ResourceRequest {
  cpu: number; // in cores
  memory: number; // in bytes
}

export abstract class ResourceMonitor {
  protected cacheTimeoutMs = 5_000;
  protected lastUpdateMs = 0;

  protected cachedResources: NodeResources = {
    cpuTotal: 0,
    cpuAvailable: 0,
    memoryTotal: 0,
    memoryAvailable: 0,
  };

  protected resourceParser: ResourceParser;

  constructor(Parser: new () => ResourceParser) {
    this.resourceParser = new Parser();
  }

  abstract getNodeResources(fromCache?: boolean): Promise<NodeResources>;

  blockResources(resources: MachineResources): void {
    const { cpu, memory } = this.toResourceRequest(resources);

    logger.debug("[ResourceMonitor] Blocking resources", {
      raw: resources,
      converted: { cpu, memory },
    });

    this.cachedResources.cpuAvailable -= cpu;
    this.cachedResources.memoryAvailable -= memory;
  }

  async wouldFit(request: ResourceRequest): Promise<boolean> {
    const resources = await this.getNodeResources();
    return resources.cpuAvailable >= request.cpu && resources.memoryAvailable >= request.memory;
  }

  private toResourceRequest(resources: MachineResources): ResourceRequest {
    return {
      cpu: resources.cpu ?? 0,
      memory: this.gbToBytes(resources.memory ?? 0),
    };
  }

  private gbToBytes(gb: number): number {
    return gb * 1024 * 1024 * 1024;
  }

  protected isCacheValid(): boolean {
    return this.cachedResources !== null && Date.now() - this.lastUpdateMs < this.cacheTimeoutMs;
  }

  protected applyOverrides(resources: NodeResources): NodeResources {
    if (!env.OVERRIDE_CPU_TOTAL && !env.OVERRIDE_MEMORY_TOTAL_GB) {
      return resources;
    }

    logger.debug("[ResourceMonitor] 🛡️ Applying resource overrides", {
      cpuTotal: env.OVERRIDE_CPU_TOTAL,
      memoryTotalGb: env.OVERRIDE_MEMORY_TOTAL_GB,
    });

    const cpuTotal = env.OVERRIDE_CPU_TOTAL ?? resources.cpuTotal;
    const memoryTotal = env.OVERRIDE_MEMORY_TOTAL_GB
      ? this.gbToBytes(env.OVERRIDE_MEMORY_TOTAL_GB)
      : resources.memoryTotal;

    const cpuDiff = cpuTotal - resources.cpuTotal;
    const memoryDiff = memoryTotal - resources.memoryTotal;

    const cpuAvailable = Math.max(0, resources.cpuAvailable + cpuDiff);
    const memoryAvailable = Math.max(0, resources.memoryAvailable + memoryDiff);

    return {
      cpuTotal,
      cpuAvailable,
      memoryTotal,
      memoryAvailable,
    };
  }
}

export class DockerResourceMonitor extends ResourceMonitor {
  private docker: Docker;

  constructor(docker: Docker) {
    super(DockerResourceParser);
    this.docker = docker;
  }

  async getNodeResources(fromCache?: boolean): Promise<NodeResources> {
    if (this.isCacheValid() || fromCache) {
      // logger.debug("[ResourceMonitor] Using cached resources");
      return this.cachedResources;
    }

    const info: TDocker.SystemInfo = await this.docker.info();
    const stats = await this.docker.listContainers({ all: true });

    // Get system-wide resources
    const cpuTotal = info.NCPU ?? 0;
    const memoryTotal = info.MemTotal ?? 0;

    // Calculate used resources from running containers
    let cpuUsed = 0;
    let memoryUsed = 0;

    for (const container of stats) {
      if (container.State === "running") {
        const c = this.docker.getContainer(container.Id);
        const { HostConfig } = await c.inspect();

        const cpu = this.resourceParser.cpu(HostConfig.NanoCpus ?? 0);
        const memory = this.resourceParser.memory(HostConfig.Memory ?? 0);

        cpuUsed += cpu;
        memoryUsed += memory;
      }
    }

    this.cachedResources = this.applyOverrides({
      cpuTotal,
      cpuAvailable: cpuTotal - cpuUsed,
      memoryTotal,
      memoryAvailable: memoryTotal - memoryUsed,
    });

    this.lastUpdateMs = Date.now();

    return this.cachedResources;
  }
}


abstract class ResourceParser {
  abstract cpu(cpu: number | string): number;
  abstract memory(memory: number | string): number;
}

class DockerResourceParser extends ResourceParser {
  cpu(cpu: number): number {
    return cpu / 1e9;
  }

  memory(memory: number): number {
    return memory;
  }
}

