/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-var-requires */
const { ts, Project } = require('ts-morph');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const I18nextParser = require('i18next-parser').gulp;
const gulp = require('gulp');
const config = require('./i18next-parser.config.js');

const nsPaths = {
  // components: 'src/components',
  // hooks: 'src/hooks',
  // modules: 'src/modules',
  // account: 'src/scenes/Account',
  // accountsWithN4: 'src/scenes/AccountsWithN4',
  // adsConfig: 'src/scenes/Administration/containers/AdsConfig',
  // adTags: 'src/scenes/Administration/containers/AdTags',
  // admin_batch: 'src/scenes/Administration/containers/Batch',
  // admin_businessClick: 'src/scenes/Administration/containers/BusinessClick',
  // admin_companies: 'src/scenes/Administration/containers/Companies',
  // admin_localization: 'src/scenes/Administration/containers/Localization',
  // admin_mail: 'src/scenes/Administration/containers/Mail',
  // admin_sbConfig: 'src/scenes/Administration/containers/SbConfig',
  // admin_users: 'src/scenes/Administration/containers/Users',
  // appNexus: 'src/scenes/AppNexus',
  // bookingTool: 'src/scenes/BookingTool',
  // brands: 'src/scenes/Brands',
  // campaigns: 'src/scenes/Campaigns',
  // contacts: 'src/scenes/Contacts',
  // IENotice: 'src/scenes/IENotice',
  // login: 'src/scenes/Login',
  // notFound: 'src/scenes/NotFound',
  // payoutReports: 'src/scenes/PayoutReports',
  // publisher: 'src/scenes/Publisher',
  // selfBookingTool: 'src/scenes/SelfBookingTool',
  serviceDashboard: 'src/scenes/ServiceDashboard',
  // targeting: 'src/scenes/Targeting',
  // websiteMappings: 'src/scenes/WebsiteMappings',
  // websites: 'src/scenes/Websites',
  // reporting: 'src/scenes/Workflow',
};

const EN_LOCALES_PATH = 'locales/en';
const DE_LOCALES_PATH = 'locales/de';
const LOCALE_PATH = {
  EN: EN_LOCALES_PATH,
  DE: DE_LOCALES_PATH,
};

async function transformSourcesForKey(keys, sourceFilesPath, namespace) {
  console.log(`Transforming source files for keys: ${keys} in ${sourceFilesPath} to ns: ${namespace}`);
  const project = new Project({
    tsConfigFilePath: path.resolve(__dirname, './tsconfig.json'),
  });
  const sourceFiles = project.getSourceFiles(path.resolve(__dirname, `${sourceFilesPath}/**/*.{ts,tsx,js,jsx}`));
  function isTFunc(node) {
    return (
      ts.isCallExpression(node) && (node.expression.escapedText === 't' || node.expression?.name?.escapedText === 't')
    );
  }
  function isStringLiteralArgs(node) {
    return ts.isStringLiteral(node.arguments[0]);
  }
  function isUseTranslationFunc(node) {
    return ts.isCallExpression(node) && node.expression.escapedText === 'useTranslation';
  }

  // transform useTranslation to support namespaces
  // only when doing initial transformation i.e. keys ['any']
  if (keys[0] === 'any') {
    sourceFiles.forEach((sourceFile) => {
      sourceFile.transform((traversal) => {
        const node = traversal.visitChildren();
        const ns = namespace;
        if (isUseTranslationFunc(node)) {
          const arg = ts.factory.createArrayLiteralExpression([
            // fallback to translation as backend coming strings are not gathered yet
            ts.factory.createStringLiteral('translation', true),
            ts.factory.createStringLiteral('common', true),
            ts.factory.createStringLiteral(`${ns}`, true),
          ]);
          return ts.factory.updateCallExpression(node, node.expression, [], [arg]);
        }
        return node;
      });
    });
  }

  // find the t function and transform for each key
  for (const keyLookup of keys) {
    sourceFiles.forEach((sourceFile) => {
      sourceFile.transform((traversal) => {
        const node = traversal.visitChildren();
        // looking for pure t func
        if (isTFunc(node) && isStringLiteralArgs(node)) {
          const [argument, ...rest] = node.arguments;
          const [currentNs, key] = keyLookup === 'any' ? [undefined, argument.text] : argument.text.split(':');
          // don't change if its already a common namesapce
          if (currentNs === 'common') return node;
          const ns = namespace;
          // if this key is the one we need to transform for or transform all keys
          if (key === keyLookup || keyLookup === 'any') {
            // since backend is default fallback namespace we need to include it as a key only
            const keyString = currentNs === 'backend' ? `${key}` : `${ns}:${key}`;
            const text = ts.factory.createStringLiteral(keyString, true);
            return ts.factory.updateCallExpression(node, node.expression, [], [text, ...rest]);
          }
        }
        return node;
      });
    });
  }

  project.saveSync();
}

function cleanTranslationDuplicates() {
  console.log('populating translations and cleaning duplicates');
  const duplicates = []; // array of duplicate keys
  const files = {
    EN: {
      common: {},
    },
    DE: {
      common: {},
    },
  };

  const translation = {};

  Object.keys(nsPaths).forEach((ns) => {
    const dataEn = JSON.parse(fs.readFileSync(path.resolve(__dirname, `${EN_LOCALES_PATH}/${ns}.json`)));
    const dataDe = JSON.parse(fs.readFileSync(path.resolve(__dirname, `${DE_LOCALES_PATH}/${ns}.json`)));
    const translationEn = JSON.parse(fs.readFileSync(path.resolve(__dirname, `${EN_LOCALES_PATH}/translation.json`)));
    const translationDe = JSON.parse(fs.readFileSync(path.resolve(__dirname, `${DE_LOCALES_PATH}/translation.json`)));
    files['EN'][ns] = dataEn;
    files['DE'][ns] = dataDe;
    translation['EN'] = translationEn;
    translation['DE'] = translationDe;
  });

  // const backend = JSON.parse(JSON.stringify(translation));

  Object.keys(files).forEach((locale) => {
    Object.keys(files[locale]).forEach((currentNs) => {
      Object.keys(files[locale]).forEach((nextNs) => {
        if (currentNs !== nextNs) {
          Object.keys(files[locale][currentNs]).forEach((item) => {
            if (Object.keys(files[locale][nextNs]).includes(item)) {
              if (translation[locale][item]) {
                files[locale].common[item] = translation[locale][item];
              }
              if (currentNs !== 'common') delete files[locale][currentNs][item];
              if (nextNs !== 'common') delete files[locale][nextNs][item];
              if (duplicates.indexOf(item) === -1) duplicates.push(item);
            } else if (translation[locale][item]) {
              files[locale][currentNs][item] = translation[locale][item];
            }
            // delete from remais, so we know what keys are still left
            // to create separate common namespace for leftovers
            // delete backend[locale][item];
          });
        }
      });
    });
  });

  console.log(files);
  // report missing translations
  // const missing = {};
  // Object.keys(files).forEach((locale) => {
  //   Object.keys(files[locale]).forEach((ns) => {
  //     Object.keys(files[locale][ns]).forEach((key) => {
  //       if (files[locale][ns][key] === '') {
  //         console.log(ns, key);
  //         if (!missing[locale]) missing[locale] = {};
  //         if (!missing[locale][ns]) missing[locale][ns] = {};
  //         missing[locale][ns][key] = '';
  //       }
  //     });
  //   });
  // });
  // save missing.json
  // Object.keys(missing).forEach((locale) => {
  //   fs.writeFileSync(
  //     path.resolve(__dirname, `${LOCALE_PATH[locale]}/missing.json`), JSON.stringify(missing[locale], null, 4),
  //   );
  // });

  // save updated files
  // Object.keys(files).forEach((locale) => {
  //   Object.keys(files[locale]).forEach((ns) => {
  //     fs.writeFileSync(
  //       path.resolve(__dirname, `${LOCALE_PATH[locale]}/${ns}.json`), JSON.stringify(files[locale][ns], null, 4),
  //     );
  //   });
  // });

  // Object.keys(backend).forEach((locale) => {
  //   fs.writeFileSync(
  //     path.resolve(__dirname, `${LOCALE_PATH[locale]}/backend.json`), JSON.stringify(backend[locale], null, 4),
  //   );
  // });

  // transform source files to common ns
  // for (const ns of Object.keys(nsPaths)) {
  //   const sourcePath = nsPaths[ns];
  //   transformSourcesForKey(duplicates, sourcePath, 'common');
  // }
  console.log('ALL DONE');
}

function prepareLocaleFiles() {
  for (const ns of Object.keys(nsPaths)) {
    const sourcePath = nsPaths[ns];
    // transformSourcesForKey(['any'], sourcePath, ns);
    const joinedPath = `${path.resolve(__dirname, sourcePath)}/**/*.{js,ts,tsx}`;
    console.log(joinedPath);
    // eslint-disable-next-line max-len
    const command = `i18next '${joinedPath}' --config ${path.resolve(__dirname, './i18next-parser.config.js')}`;
    execSync(command);
    console.log('Parsing source for keys');
    // gulp
    //   .src(joinedPath)
    //   .pipe(
    //     new I18nextParser(config),
    //   )
    //   .pipe(gulp.dest('./'));
  }
}

async function main() {
  prepareLocaleFiles();
  // cleanTranslationDuplicates();
}

main();
