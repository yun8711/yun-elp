/**
 * 缓存工具类，缓存组件信息
 */

import { readFileSync } from 'fs';
import { join } from 'path';
import { ROOT_DIR } from '../constants/path.js';

interface CacheItem<Value> {
    /**
     * 缓存值
     */
    value: Value
}

interface CacheMetadata {
    /**
     * 组件库版本号
     */
    libraryVersion: string;
}


/**
 * 组件库状态检测器
 */
class ComponentLibraryStateDetector {
    private cachedVersion: string | null = null;

    /**
     * 获取组件库当前版本号
     */
    public getCurrentVersion(): string {
        try {
            const packageJsonPath = join(ROOT_DIR, 'package.json');
            const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
            return packageJson.version || '0.0.0';
        } catch {
            return '0.0.0';
        }
    }

    /**
     * 获取组件库版本状态
     */
    public getCurrentState(): CacheMetadata {
        const currentVersion = this.getCurrentVersion();

        // 如果版本没有变化，返回缓存的状态
        if (this.cachedVersion === currentVersion) {
            return { libraryVersion: currentVersion };
        }

        // 版本发生变化，更新缓存
        this.cachedVersion = currentVersion;
        return { libraryVersion: currentVersion };
    }
}

/**
 * 缓存工具类
 * 基于组件库版本号的智能缓存
 */
export class Cache<CacheData extends Record<string, any>> {
    // 保存缓存数据的Map
    private cache: Map<keyof CacheData, CacheItem<CacheData[keyof CacheData]>> = new Map();
    // 组件库状态检测器，通过检查组件库版本是否发生变化
    private stateDetector: ComponentLibraryStateDetector;
    // 上次已知的组件库版本号
    private lastKnownVersion: string | null = null;
    // 初始化组件库状态检测器
    constructor() {
        this.stateDetector = new ComponentLibraryStateDetector();
    }

    /**
     * 缓存组件信息
     * @param key
     * @param value
     */
    public set<CacheKey extends keyof CacheData>(key: CacheKey, value: CacheData[CacheKey]) {
        // 设置缓存前确保版本状态是最新的
        if (!this.lastKnownVersion) {
            this.lastKnownVersion = this.stateDetector.getCurrentVersion();
        }

        this.cache.set(key, {
            value
        })
    }

    /**
     * 检查组件库版本是否已更新，如果更新则清除缓存
     */
    private checkLibraryVersion(): void {
        const currentVersion = this.stateDetector.getCurrentVersion();

        // 如果版本发生变化，清除所有缓存
        if (this.lastKnownVersion && currentVersion !== this.lastKnownVersion) {
            this.cache.clear();
        }

        this.lastKnownVersion = currentVersion;
    }

    /**
     * 获取组件信息
     * @param key 组件key
     * @returns 组件信息
     */
    public get<CacheKey extends keyof CacheData>(key: CacheKey): CacheData[CacheKey] | undefined {
        // 先检查组件库版本，如果更新则清除缓存
        this.checkLibraryVersion();

        const value = this.cache.get(key)
        if (!value) return undefined

        // 跳过TTL检查，依赖版本控制
        return value.value;
    }
    /**
     * 删除组件信息
     * @param key 组件key
     */
    public delete(key: keyof CacheData) {
        this.cache.delete(key)
    }

    /**
     * 清空缓存
     */
    public clear() {
        this.cache.clear()
    }
}
