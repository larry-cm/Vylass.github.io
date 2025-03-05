globalThis.process ??= {}; globalThis.process.env ??= {};
import { o as decodeKey } from './chunks/astro/server_BAM4cObl.mjs';
import './chunks/astro-designed-error-pages_DjhGbQDU.mjs';
import { N as NOOP_MIDDLEWARE_FN } from './chunks/noop-middleware_DQzgs3RX.mjs';

function sanitizeParams(params) {
  return Object.fromEntries(
    Object.entries(params).map(([key, value]) => {
      if (typeof value === "string") {
        return [key, value.normalize().replace(/#/g, "%23").replace(/\?/g, "%3F")];
      }
      return [key, value];
    })
  );
}
function getParameter(part, params) {
  if (part.spread) {
    return params[part.content.slice(3)] || "";
  }
  if (part.dynamic) {
    if (!params[part.content]) {
      throw new TypeError(`Missing parameter: ${part.content}`);
    }
    return params[part.content];
  }
  return part.content.normalize().replace(/\?/g, "%3F").replace(/#/g, "%23").replace(/%5B/g, "[").replace(/%5D/g, "]");
}
function getSegment(segment, params) {
  const segmentPath = segment.map((part) => getParameter(part, params)).join("");
  return segmentPath ? "/" + segmentPath : "";
}
function getRouteGenerator(segments, addTrailingSlash) {
  return (params) => {
    const sanitizedParams = sanitizeParams(params);
    let trailing = "";
    if (addTrailingSlash === "always" && segments.length) {
      trailing = "/";
    }
    const path = segments.map((segment) => getSegment(segment, sanitizedParams)).join("") + trailing;
    return path || "/";
  };
}

function deserializeRouteData(rawRouteData) {
  return {
    route: rawRouteData.route,
    type: rawRouteData.type,
    pattern: new RegExp(rawRouteData.pattern),
    params: rawRouteData.params,
    component: rawRouteData.component,
    generate: getRouteGenerator(rawRouteData.segments, rawRouteData._meta.trailingSlash),
    pathname: rawRouteData.pathname || void 0,
    segments: rawRouteData.segments,
    prerender: rawRouteData.prerender,
    redirect: rawRouteData.redirect,
    redirectRoute: rawRouteData.redirectRoute ? deserializeRouteData(rawRouteData.redirectRoute) : void 0,
    fallbackRoutes: rawRouteData.fallbackRoutes.map((fallback) => {
      return deserializeRouteData(fallback);
    }),
    isIndex: rawRouteData.isIndex,
    origin: rawRouteData.origin
  };
}

function deserializeManifest(serializedManifest) {
  const routes = [];
  for (const serializedRoute of serializedManifest.routes) {
    routes.push({
      ...serializedRoute,
      routeData: deserializeRouteData(serializedRoute.routeData)
    });
    const route = serializedRoute;
    route.routeData = deserializeRouteData(serializedRoute.routeData);
  }
  const assets = new Set(serializedManifest.assets);
  const componentMetadata = new Map(serializedManifest.componentMetadata);
  const inlinedScripts = new Map(serializedManifest.inlinedScripts);
  const clientDirectives = new Map(serializedManifest.clientDirectives);
  const serverIslandNameMap = new Map(serializedManifest.serverIslandNameMap);
  const key = decodeKey(serializedManifest.key);
  return {
    // in case user middleware exists, this no-op middleware will be reassigned (see plugin-ssr.ts)
    middleware() {
      return { onRequest: NOOP_MIDDLEWARE_FN };
    },
    ...serializedManifest,
    assets,
    componentMetadata,
    inlinedScripts,
    clientDirectives,
    routes,
    serverIslandNameMap,
    key
  };
}

const manifest = deserializeManifest({"hrefRoot":"file:///mnt/c/Users/Larry/Desktop/proyectos/aprendizaje-astro/Vylass.github.io/","cacheDir":"file:///mnt/c/Users/Larry/Desktop/proyectos/aprendizaje-astro/Vylass.github.io/node_modules/.astro/","outDir":"file:///mnt/c/Users/Larry/Desktop/proyectos/aprendizaje-astro/Vylass.github.io/dist/","srcDir":"file:///mnt/c/Users/Larry/Desktop/proyectos/aprendizaje-astro/Vylass.github.io/src/","publicDir":"file:///mnt/c/Users/Larry/Desktop/proyectos/aprendizaje-astro/Vylass.github.io/public/","buildClientDir":"file:///mnt/c/Users/Larry/Desktop/proyectos/aprendizaje-astro/Vylass.github.io/dist/","buildServerDir":"file:///mnt/c/Users/Larry/Desktop/proyectos/aprendizaje-astro/Vylass.github.io/dist/_worker.js/","adapterName":"@astrojs/cloudflare","routes":[{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"page","component":"_server-islands.astro","params":["name"],"segments":[[{"content":"_server-islands","dynamic":false,"spread":false}],[{"content":"name","dynamic":true,"spread":false}]],"pattern":"^\\/_server-islands\\/([^/]+?)\\/?$","prerender":false,"isIndex":false,"fallbackRoutes":[],"route":"/_server-islands/[name]","origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"type":"endpoint","isIndex":false,"route":"/_image","pattern":"^\\/_image\\/?$","segments":[[{"content":"_image","dynamic":false,"spread":false}]],"params":[],"component":"node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint.js","pathname":"/_image","prerender":false,"fallbackRoutes":[],"origin":"internal","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/getusers","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/getUsers\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"getUsers","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/getUsers.ts","pathname":"/api/getUsers","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/users.json","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/users\\.json\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"users.json","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/api/users.json.ts","pathname":"/api/users.json","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[],"routeData":{"route":"/api/[id_delete]","isIndex":false,"type":"endpoint","pattern":"^\\/api\\/([^/]+?)\\/?$","segments":[[{"content":"api","dynamic":false,"spread":false}],[{"content":"id_delete","dynamic":true,"spread":false}]],"params":["id_delete"],"component":"src/pages/api/[id_delete].ts","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/bases-de-datos.CKcWlt-1.css"}],"routeData":{"route":"/bases-de-datos","isIndex":false,"type":"page","pattern":"^\\/bases-de-datos\\/?$","segments":[[{"content":"bases-de-datos","dynamic":false,"spread":false}]],"params":[],"component":"src/pages/bases-de-datos.astro","pathname":"/bases-de-datos","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}},{"file":"","links":[],"scripts":[],"styles":[{"type":"external","src":"/_astro/bases-de-datos.CKcWlt-1.css"},{"type":"inline","content":":root{--bg: white;--h-mini: 50px}\n"}],"routeData":{"route":"/","isIndex":true,"type":"page","pattern":"^\\/$","segments":[],"params":[],"component":"src/pages/index.astro","pathname":"/","prerender":false,"fallbackRoutes":[],"distURL":[],"origin":"project","_meta":{"trailingSlash":"ignore"}}}],"base":"/","trailingSlash":"ignore","compressHTML":true,"componentMetadata":[["/mnt/c/Users/Larry/Desktop/proyectos/aprendizaje-astro/Vylass.github.io/src/pages/bases-de-datos.astro",{"propagation":"none","containsHead":true}],["/mnt/c/Users/Larry/Desktop/proyectos/aprendizaje-astro/Vylass.github.io/src/pages/index.astro",{"propagation":"none","containsHead":true}]],"renderers":[],"clientDirectives":[["idle","(()=>{var l=(n,t)=>{let i=async()=>{await(await n())()},e=typeof t.value==\"object\"?t.value:void 0,s={timeout:e==null?void 0:e.timeout};\"requestIdleCallback\"in window?window.requestIdleCallback(i,s):setTimeout(i,s.timeout||200)};(self.Astro||(self.Astro={})).idle=l;window.dispatchEvent(new Event(\"astro:idle\"));})();"],["load","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).load=e;window.dispatchEvent(new Event(\"astro:load\"));})();"],["media","(()=>{var n=(a,t)=>{let i=async()=>{await(await a())()};if(t.value){let e=matchMedia(t.value);e.matches?i():e.addEventListener(\"change\",i,{once:!0})}};(self.Astro||(self.Astro={})).media=n;window.dispatchEvent(new Event(\"astro:media\"));})();"],["only","(()=>{var e=async t=>{await(await t())()};(self.Astro||(self.Astro={})).only=e;window.dispatchEvent(new Event(\"astro:only\"));})();"],["visible","(()=>{var a=(s,i,o)=>{let r=async()=>{await(await s())()},t=typeof i.value==\"object\"?i.value:void 0,c={rootMargin:t==null?void 0:t.rootMargin},n=new IntersectionObserver(e=>{for(let l of e)if(l.isIntersecting){n.disconnect(),r();break}},c);for(let e of o.children)n.observe(e)};(self.Astro||(self.Astro={})).visible=a;window.dispatchEvent(new Event(\"astro:visible\"));})();"]],"entryModules":{"\u0000astro-internal:middleware":"_astro-internal_middleware.mjs","\u0000@astro-page:node_modules/@astrojs/cloudflare/dist/entrypoints/image-endpoint@_@js":"pages/_image.astro.mjs","\u0000@astro-page:src/pages/api/getUsers@_@ts":"pages/api/getusers.astro.mjs","\u0000@astro-page:src/pages/api/users.json@_@ts":"pages/api/users.json.astro.mjs","\u0000@astro-page:src/pages/api/[id_delete]@_@ts":"pages/api/_id_delete_.astro.mjs","\u0000@astro-page:src/pages/bases-de-datos@_@astro":"pages/bases-de-datos.astro.mjs","\u0000@astro-page:src/pages/index@_@astro":"pages/index.astro.mjs","\u0000@astrojs-ssr-virtual-entry":"index.js","\u0000@astro-renderers":"renderers.mjs","\u0000@astrojs-ssr-adapter":"_@astrojs-ssr-adapter.mjs","\u0000@astrojs-manifest":"manifest_Cbs0jt3A.mjs","/mnt/c/Users/Larry/Desktop/proyectos/aprendizaje-astro/Vylass.github.io/node_modules/astro/dist/assets/services/sharp.js":"chunks/sharp_xoWqywdq.mjs","@/components/section1/UsersTable":"_astro/UsersTable.Ceso1jfG.js","@components/section1/Form":"_astro/Form.CgR07pci.js","@astrojs/react/client.js":"_astro/client.BO3Rm8ny.js","/mnt/c/Users/Larry/Desktop/proyectos/aprendizaje-astro/Vylass.github.io/node_modules/astro/components/ClientRouter.astro?astro&type=script&index=0&lang.ts":"_astro/ClientRouter.astro_astro_type_script_index_0_lang.Cainpjm5.js","astro:scripts/before-hydration.js":""},"inlinedScripts":[],"assets":["/_astro/logo.DfYQMzr5.svg","/_astro/bases-de-datos.CKcWlt-1.css","/logo.svg","/_astro/ClientRouter.astro_astro_type_script_index_0_lang.Cainpjm5.js","/_astro/Form.CgR07pci.js","/_astro/UsersTable.Ceso1jfG.js","/_astro/client.BO3Rm8ny.js","/_astro/index.Dy6lLLXr.js","/_astro/jsx-runtime.D_zvdyIk.js","/_worker.js/_@astrojs-ssr-adapter.mjs","/_worker.js/_astro-internal_middleware.mjs","/_worker.js/index.js","/_worker.js/renderers.mjs","/imgs/man.png","/_worker.js/_astro/bases-de-datos.CKcWlt-1.css","/_worker.js/_astro/logo.DfYQMzr5.svg","/_worker.js/pages/_image.astro.mjs","/_worker.js/pages/bases-de-datos.astro.mjs","/_worker.js/pages/index.astro.mjs","/_worker.js/chunks/_@astro-renderers_BRUByLfp.mjs","/_worker.js/chunks/_@astrojs-ssr-adapter_CKsVrS57.mjs","/_worker.js/chunks/astro-designed-error-pages_DjhGbQDU.mjs","/_worker.js/chunks/astro_CgZCZ0Lf.mjs","/_worker.js/chunks/configTurso_Cugks_Zz.mjs","/_worker.js/chunks/index_CRqhzNJf.mjs","/_worker.js/chunks/jsx-runtime_NUDKRqYk.mjs","/_worker.js/chunks/noop-middleware_DQzgs3RX.mjs","/_worker.js/chunks/path_h5kZAkfu.mjs","/_worker.js/chunks/sharp_xoWqywdq.mjs","/_worker.js/pages/api/_id_delete_.astro.mjs","/_worker.js/pages/api/getusers.astro.mjs","/_worker.js/pages/api/users.json.astro.mjs","/_worker.js/chunks/astro/server_BAM4cObl.mjs"],"buildFormat":"directory","checkOrigin":true,"serverIslandNameMap":[],"key":"d3rb49w1dTISYBQQowCkj57mCwNE7JmoaaHzed/ojdQ="});
if (manifest.sessionConfig) manifest.sessionConfig.driverModule = null;

export { manifest };
