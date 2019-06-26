const path = require('path')

const {
  sortDependencies,
  installDependencies,
  // runLintFix,
  printMessage
} = require('./utils')

const templateVersion = require('./package.json').version

module.exports = function (data) {
  return {
    metalsmith: {
      before (metalsmith) {
        Object.assign(
          metalsmith.metadata(),
          { isNotTest: true }
        )
      }
    },
    helpers: {
      if_or (v1, v2, options) {
        if (v1 || v2) {
          return options.fn(this)
        }

        return options.inverse(this)
      },
      template_version () {
        return templateVersion
      }
    },
    prompts: {
      name: {
        when: 'isNotTest',
        type: 'string',
        required: true,
        message: 'Project name',
        default: data.destDirName || 'daruk-example'
      },
      description: {
        when: 'isNotTest',
        type: 'string',
        required: false,
        message: 'Project description',
        default: 'A daruk project'
      },
      author: {
        when: 'isNotTest',
        type: 'string',
        required: true,
        message: 'Author'
      },
      authorEmail: {
        when: 'isNotTest',
        type: 'string',
        required: true,
        message: 'Email'
      },
      // globalModules: {
      //   when: 'isNotTest',
      //   type: 'checkbox',
      //   message: 'select the global module you need, you must install it in global by yourself',
      //   choices: [
      //     {
      //       name: 'node-rdkafka',
      //       value: 'node-rdkafka',
      //       short: 'node-rdkafka',
      //       description: 'node-rdkafka in global module',
      //       link: 'https://github.com/Blizzard/node-rdkafka',
      //       checked: false
      //     }
      //   ]
      // },
      // lint: {
      //   when: 'isNotTest',
      //   type: 'confirm',
      //   message: 'Use TSLint to lint your code?'
      // },
      // lintConfig: {
      //   when: 'isNotTest && lint',
      //   type: 'list',
      //   message: 'Pick an ESLint preset',
      //   choices: [
      //     {
      //       name: 'Standard (https://github.com/standard/standard)',
      //       value: 'standard',
      //       short: 'Standard'
      //     },
      //     {
      //       name: 'Airbnb (https://github.com/airbnb/javascript)',
      //       value: 'airbnb',
      //       short: 'Airbnb'
      //     },
      //     {
      //       name: 'none (configure it yourself)',
      //       value: 'none',
      //       short: 'none'
      //     }
      //   ]
      // },
      autoInstall: {
        when: 'isNotTest',
        type: 'list',
        message:
          'Should we run `yarn install` for you after the project has been created? (recommended)',
        choices: [
          // {
          //   name: 'Yes, use NPM',
          //   value: 'npm',
          //   short: 'npm'
          // },
          {
            name: 'Yes, use Yarn',
            value: 'yarn',
            short: 'yarn'
          },
          {
            name: 'No, I will handle that myself',
            value: false,
            short: 'no'
          }
        ]
      }
    },
    filters: {
      // 'tslint.json': 'lint'
      // 'config/test.env.js': 'unit || e2e',
      // 'build/webpack.test.conf.js': "unit && runner === 'karma'",
      // 'src/router/**/*': 'router'
    },
    complete: function (data, { chalk }) {
      const green = chalk.green

      sortDependencies(data, green)

      const cwd = path.join(process.cwd(), data.inPlace ? '' : data.destDirName)

      if (data.autoInstall) {
        installDependencies(cwd, data.autoInstall, green)
          // .then(() => {
          //   return runLintFix(cwd, data, green)
          // })
          .then(() => {
            printMessage(data, green)
          })
          .catch(e => {
            console.log(chalk.red('Error:'), e)
          })
      } else {
        printMessage(data, chalk)
      }
    }
  }
}
