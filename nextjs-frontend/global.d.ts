// CSS Module declarations (*.module.css files)
declare module '*.module.css' {
  const content: { [className: string]: string };
  export default content;
}

// Regular CSS side-effect imports (global stylesheets)
declare module '*.css' {
  const content: void;
  export default content;
}
