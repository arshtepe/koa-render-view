const path = require("path");
const fs = require("fs-extra");
const _ = require("lodash");
const ALIAS_REGEXP = /^[@#!$_]\w+/;

class Utils {

    static aliasListToMap(aliasList) {
        return aliasList.reduce((map, {alias, path}) => {
            if (!ALIAS_REGEXP.test(alias)) {
                throw new Error(`Invalid alias value: ${alias}, alias must start from @#!$_ symbols and cann\`t contain symbols: .\\/ `);
            }
            map.set(alias, path);
            return map;
        }, new Map());
    }

    static getTemplatePath(files, renderPath, aliases) {
        //TODO check windows
        const splittedPath = renderPath = renderPath.split("/");

        if (aliases.has(splittedPath[0])) {
            splittedPath[0] = aliases.get(splittedPath[0]);
            return splittedPath.join("/");
        }

        const templatePath = files.find(file => file.path.lastIndexOf(renderPath) !== -1);
        if (!templatePath) {
            throw new Error(`File ${renderPath} not found`);
        }

        return templatePath.path;
    }


    static getFileInfo(renderPath, extension) {
        let fileExtension = path.extname(renderPath).slice(1); //replace dot
        if (!fileExtension) {
            renderPath = `${renderPath}.${extension}`;
            fileExtension = extension;
        }
        return {
            renderPath,
            fileExtension
        };
    }

    static stat(pathTo) {
        return new Promise((resolve, reject) => {
            fs.stat(pathTo, (err, stat) => {
                if (err) {
                    return reject(err);
                }
                resolve(stat);
            });
        })
    }

    static _readdir(viewPath) {
        return fs.readdir(viewPath)
            .then(dirFiles => dirFiles.map(file => ({
                file,
                path: path.join(viewPath, file)
            })));
    }

    static _getItemFromPath(viewPath) {
        return {
            path: viewPath,
            file: path.basename(viewPath)
        };
    }

    static getFilesSync(viewPathList, recursive) {
        let result = [];
        viewPathList = Array.isArray(viewPathList) ? viewPathList : [viewPathList];
        viewPathList.forEach(viewPath => {
            const stat = fs.statSync(viewPath);
            if (stat.isDirectory()) {
                const files = fs.readdirSync(viewPath);
                files.forEach(file => {
                    const pathToFile = path.join(viewPath, file);
                    if (!fs.statSync(pathToFile).isDirectory()) {
                        result.push(this._getItemFromPath(pathToFile));
                    } else if (recursive) {
                        result = [...result, ...this.getFilesSync(pathToFile, recursive)]
                    }
                });
            } else {
                result.push(this._getItemFromPath(viewPath));
            }
        });

        return result;
    }

    static async getFiles(viewPathList, recursive) {
        //TODO refactor this
        viewPathList = Array.isArray(viewPathList) ? viewPathList : [viewPathList];
        let result = [];
        const promises = viewPathList.map(viewPath =>
            this.stat(viewPath)
                .then(stat => {
                    if (stat.isDirectory()) {
                        return this._readdir(viewPath).then(res => {
                            if (recursive) {
                                return Promise.all(res.map(({path}) => this.getFiles(path, recursive)))
                                    .then(_.flattenDeep);
                            }
                            return res;
                        }).then(res => result = [...res, ...result]);
                    }

                    result.push(this._getItemFromPath(viewPath));
                    return Promise.resolve();
                })
        );

        await Promise.all(promises);

        return result;
    }


    static readFile(path) {
        return new Promise((resolve, reject) => {
            fs.readFile(path, (err, data) => {
                if (err) {
                    reject(err);
                } else {
                    resolve(data.toString());
                }
            })
        })
    }

}

module.exports = Utils;