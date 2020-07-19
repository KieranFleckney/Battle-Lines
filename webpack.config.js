const path = require('path');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const ts = require('typescript');
const { isImportDeclaration, isExportDeclaration, isStringLiteral } = require('tsutils/typeguard/node');

function getCustomTransformers() {
    return { before: [stripJsExt] };

    function stripJsExt(context) {
        return (sourceFile) => visitNode(sourceFile);

        function visitNode(node) {
            if (
                (isImportDeclaration(node) || isExportDeclaration(node)) &&
                node.moduleSpecifier &&
                isStringLiteral(node.moduleSpecifier)
            ) {
                const targetModule = node.moduleSpecifier.text;
                if (targetModule.endsWith('.js')) {
                    const newTarget = targetModule.slice(0, targetModule.length - 3);
                    return isImportDeclaration(node)
                        ? ts.updateImportDeclaration(
                              node,
                              node.decorators,
                              node.modifiers,
                              node.importClause,
                              ts.createLiteral(newTarget)
                          )
                        : ts.updateExportDeclaration(
                              node,
                              node.decorators,
                              node.modifiers,
                              node.exportClause,
                              ts.createLiteral(newTarget)
                          );
                }
            }
            return ts.visitEachChild(node, visitNode, context);
        }
    }
}

module.exports = {
    mode: 'production',
    entry: {
        BattleLines: './src/Index.ts',
        'BattleLines.min': './src/Index.ts',
    },
    node: {
        Buffer: false,
        global: false,
        __filename: false,
        __dirname: false,
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        libraryTarget: 'umd',
        library: 'BattleLines',
        umdNamedDefine: true,
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js'],
    },
    devtool: 'source-map',
    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                sourceMap: true,
                include: /\.min\.js$/,
            }),
        ],
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                loader: 'ts-loader',
                exclude: /node_modules/,
                options: { compilerOptions: { declaration: false }, getCustomTransformers },
            },
        ],
    },
};
