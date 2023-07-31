const fs = require('fs');
const path = require('path');

// Получить путь к создаваемой папке из аргумента командной строки
const targetPath = process.argv[2];
let componentName = process.argv.slice(3);

if (!componentName) throw new Error(`Неверное название компонента ${componentName}`);
if (!targetPath) throw new Error(`Неверный путь ${targetPath}`);

componentName = componentName
  .map((part) => part[0].toUpperCase() + part.slice(1))
  .join('');
const dir = `${targetPath}/${componentName}`;

// Если путь есть
if (fs.existsSync(targetPath)) {
  if (fs.existsSync(dir)) {
    console.log(`Папка ${dir} уже существует!`);
    return;
  }

  // Создать папку в нашем пути
  fs.mkdirSync(dir);
  console.log(`Папка ${dir} успешно создана.`);

  const filesToCreate = [
    {
      name: `${componentName}.tsx`,
      code: `import styles from './${componentName}.module.css'\n\nexport function ${componentName}() {}`,
    },
    { name: `${componentName}.module.css`, code: '' },
    { name: 'index.ts', code: `export { ${componentName} } from './${componentName}'` },
  ];
  filesToCreate.forEach((file) => {
    const filePath = path.join(dir, file.name);
    fs.writeFileSync(filePath, file.code);
    console.log(`Файл ${filePath} успешно создан.`);
  });
} else {
  console.log(`Путь ${targetPath} неверный!`);
}

// Пример команды для создания компонента Test
// npm run component .\src\ Test
