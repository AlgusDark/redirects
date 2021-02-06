---
title: "¿Cómo funciona esta página?"
date: 2020-11-18
---
Con la ayuda de [Hugo](http://gohugo.io/) he creado una página estática que alberga archivos `markdown`.  Estos archivos los manejo con la ayuda de [Obsidian](https://obsidian.md).

El sistema está en una fase muy temprana y aún hay bastantes cosas por mejorar como lo son:

- Actualmente transformo los [wikilinks](https://publish.obsidian.md/help/How+to/Internal+link) con expresiones regulares. Podría mejorarse bastante si creara un plugin para [goldmark](https://github.com/yuin/goldmark) pero primero necesito aprender Go.
- Algo interesante en Obsidian es [incrustar media o archivos](https://publish.obsidian.md/help/How+to/Embed+files). Para hacerlo podría usar una expresión regular para extraer parte del archivo.
- Sería genial crear un sistema de búsqueda, quizá explorando [Fuse.js](https://fusejs.io/).
- [Obsidian](https://obsidian.md) tiene un sistema muy interesante de [tags](https://publish.obsidian.md/help/How+to/Working+with+tags). Hugo tiene el sistema de [taxonomies](https://gohugo.io/content-management/taxonomies/) pero sólo sirve a través de front matter. La mejor solución es esperar a que Obsidian tenga una manera sencilla de acceder al [front matter y usar su sistema de tags](https://publish.obsidian.md/help/Advanced+topics/YAML+front+matter).
- Sería bueno [crear un plugin para obsidian](https://github.com/obsidianmd/obsidian-sample-plugin) que:
	- Inserte **YAML** com `{{date}}` cada que se crea un nuevo archivo.
	- Seleccione una palabra con un `hotkey`.
	- Escanee todos los `#tags` y los agregue al **YAML**.