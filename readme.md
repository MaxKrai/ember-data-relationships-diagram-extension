# ember-data-relationships-diagram-extension
The Chrome extension allows you to render relationships class diagram based on ember-data models.

It's powered by [mermaid](https://github.com/mermaid-js/mermaid).

This is in POC status now.

## Installation
It is not published in the Chrome Web Store yet.

You can load unpacked extension to Chrome in developer mode.

```bash
npm install
npm run build
```

## Usage
Open devtools and go to tab `Ember Models Diagram`

![Image of Graph](https://github.com/MaxKrai/ember-data-relationships-diagram-extension/blob/images/diagram-demo.png?raw=true)

You can scale the page using special range input.

![Image of Graph](https://github.com/MaxKrai/ember-data-relationships-diagram-extension/blob/images/demo-zoom.png?raw=true)

It's available to define specific model. In this case only related models will be rendered on a diagram.

![Image of Graph](https://github.com/MaxKrai/ember-data-relationships-diagram-extension/blob/images/demo-specific-model.png?raw=true)
You can save svg-based diagram as html file.

## Key Features
* It reads all Ember Data models registered in your Ember application at the time the dev tab was opened.
It means that it processes any models that come via common way with any structure, from addons or via dynamic registration.
* It represents `@hasMany`, `@belongsTo` and `extends` relationships between models.
* You can place all models on the diagram, or you can choose some model to visualize everything related to.

## Things to improve
* Add polymorphic indicator
* Merge origin + inverse relationships to single one
* Visualize async/sync relationships and other stuff
* Add export support of mermaid diagram source text
* UI/UX updates

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)
