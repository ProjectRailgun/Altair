/*
 * Custom Type Definitions
 * When including 3rd party modules you also need to include the type definition for the module
 * if they don't provide one within the module. You can try to install it with typings

typings install node --save

 * If you can't find the type definition in the registry we can make an ambient definition in
 * this file for now. For example

declare module "my-module" {
  export function doesSomething(value: string): string;
}

 *
 * If you're prototying and you will fix the types later you can also declare it as type any
 *

declare var assert: any;

 *
 * If you're importing a module that uses Node.js modules which are CommonJS you need to import as
 *

import * as _ from 'lodash'

 * You can include your type definitions in this file until you create one for the typings registry
 * see https://github.com/typings/registry
 *
 */

// support NodeJS modules without type definitions
declare module '*';

// Extra variables that live on Global that will be replaced by webpack DefinePlugin
declare var ENV: string;
declare var HMR: boolean;
declare var SITE_TITLE: string;
declare var PORTAL_COVER_IMAGE: string;
declare var PORTAL_COVER_AUTHOR: string;
declare var PORTAL_COVER_LINK: string;
declare var CHROME_EXTENSION_ID: string;
declare var FIREFOX_EXTENSION_ID: string;
declare var EDGE_EXTENSION_ID: string;
declare var FIREFOX_EXTENSION_URL: string;

declare var System: SystemJS;

interface SystemJS {
    import: (path?: string) => Promise<any>;
}


interface GlobalEnvironment {
    ENV;
    HMR;
    SITE_TITLE;
    SystemJS: SystemJS;
    System: SystemJS;
}

interface Es6PromiseLoader {
    (id: string): (exportName?: string) => Promise<any>;
}

type FactoryEs6PromiseLoader = () => Es6PromiseLoader;
type FactoryPromise = () => Promise<any>;

type AsyncRoutes = {
    [component: string]: Es6PromiseLoader |
        Function |
        FactoryEs6PromiseLoader |
        FactoryPromise
};


type IdleCallbacks = Es6PromiseLoader |
    Function |
    FactoryEs6PromiseLoader |
    FactoryPromise;

interface WebpackModule {
    hot: {
        data?: any,
        idle: any,
        accept(dependencies?: string | string[], callback?: (updatedDependencies?: any) => void): void;
        decline(dependencies?: string | string[]): void;
        dispose(callback?: (data?: any) => void): void;
        addDisposeHandler(callback?: (data?: any) => void): void;
        removeDisposeHandler(callback?: (data?: any) => void): void;
        check(autoApply?: any, callback?: (err?: Error, outdatedModules?: any[]) => void): void;
        apply(options?: any, callback?: (err?: Error, outdatedModules?: any[]) => void): void;
        status(callback?: (status?: string) => void): void | string;
        removeStatusHandler(callback?: (status?: string) => void): void;
    };
}

interface WebpackRequire {
    context(file: string, flag?: boolean, exp?: RegExp): any;
}


interface ErrorStackTraceLimit {
    stackTraceLimit: number;
}


// Extend typings
interface NodeRequire extends WebpackRequire {
}

interface ErrorConstructor extends ErrorStackTraceLimit {
}

interface NodeModule extends WebpackModule {
}

interface Global extends GlobalEnvironment {
}

interface Document {

    mozFullScreenElement: Element;
    msFullscreenElement: Element;

    msRequestFullscreen(): void;

    mozRequestFullScreen(): void;

    msExitFullscreen(): void;

    mozCancelFullScreen(): void;

    documentMode: any;
}

interface Window {
    StyleMedia?: any;
}

declare var ga: Function;
declare var ga_events: any[];
// used for firefox detection
declare var InstallTrigger: any;
