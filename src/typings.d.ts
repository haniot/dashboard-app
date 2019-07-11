/* SystemJS module definition */
declare var module: NodeModule;

interface NodeModule {
    id: string;
}

declare module '*html' {
    const value: string;
    export default value
}
