const path = require("path");
const fs = require("fs-extra");
const _ = require("lodash");
const ALIAS_REGEXP = /^[@#!$_]\w+/;

class Utils {

    static validateAliases(aliases) {

        aliases.forEach(({alias}) => {
            if(!ALIAS_REGEXP.test(alias)) {
                throw new Error(`Invalid alias value: ${alias}, alias must start from @#!$_ symbols and cann\`t contain symbols: .\\/ `);
            }
        })
    }

    static findTemplate(files, relPath, aliases) {

        for (let item of aliases) {
            if (relPath.trim().indexOf(item.alias) === 0) {
                const viewPath = relPath.replace(item.alias, item.path);// @alias/index.html is replaced by /alias/path/index.html
                return this._getItemFromPath(viewPath);
            }
        }

        return files.find(file => file.path.lastIndexOf(relPath) !== -1)
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

    static async getFiles(viewPathList, recursive) {
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
}

module.exports = Utils;