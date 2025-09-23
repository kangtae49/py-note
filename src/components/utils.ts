function getFilename(path: string) {
    return path.split(/[/\\]/).pop();
}

export {
    getFilename,
};
