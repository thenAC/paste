/* eslint-disable @typescript-eslint/no-invalid-this */

import { Controller } from 'bwcx-ljsm';
import type { ControllerOptions } from 'bwcx-ljsm';
import { getIdentifierFromDecorated, getDependency } from 'bwcx-core';
import type { DependencyIdentifier } from 'bwcx-core';

/**
 * API 控制器，路由会以 `/api` 为前缀
 * @decorator {class}
 */
export function ApiController(path?: string, options?: ControllerOptions): ClassDecorator {
  return function (target) {
    Controller(path ? `/api${path}` : '/api', options)(target);
  };
}

const INJECTION_CACHE = Symbol.for('bwcx:custom:injectionCache');

function _lazyInjectProxyGetter(proto: any, key: string, identifier: DependencyIdentifier, doCache: boolean) {
  function getter() {
    // @ts-ignore
    const resolve = () => getDependency(identifier, this.ctx?.container);
    // @ts-ignore
    if (doCache && !Reflect.hasOwnMetadata(INJECTION_CACHE, this, key)) {
      // @ts-ignore
      Reflect.defineMetadata(INJECTION_CACHE, resolve(), this, key);
    }
    // @ts-ignore
    if (Reflect.hasOwnMetadata(INJECTION_CACHE, this, key)) {
      // @ts-ignore
      return Reflect.getOwnMetadata(INJECTION_CACHE, this, key);
    }
    return resolve();
  }

  function setter(newVal: any) {
    // @ts-ignore
    Reflect.defineMetadata(INJECTION_CACHE, newVal, this, key);
  }

  Object.defineProperty(proto, key, {
    configurable: true,
    enumerable: true,
    get: getter,
    set: setter,
  });
}

/**
 * 使用懒注入
 *
 * @decorator {property}
 *
 * 约定：如果注入目标是请求作用域依赖，则需要保证要使用懒注入的实例已经以 `ctx` 为属性名注入了请求上下文。
 * 寻找依赖时总会优先尝试从当前实例上注入的 ctx 容器中寻找，如果不存在已注入的 `ctx`，则 fallback 到根容器。
 */
export function LazyInject(id?: DependencyIdentifier) {
  return function (target: Object, propertyKey: string, parameterIndex?: number) {
    const identifier = getIdentifierFromDecorated(target, propertyKey, parameterIndex, id);
    _lazyInjectProxyGetter(target, propertyKey, identifier, true);
  };
}
