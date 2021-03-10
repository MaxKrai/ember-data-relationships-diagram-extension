# ember-data-relationships-graph-extension
The Chrome extension allows you to render relationships graph based on ember-data models.
It supports common graph and hierarchy graph rendering.
It's powered by [Cytoscape.js](https://js.cytoscape.org/) and 3kB [Preact](https://preactjs.com/).

This is in POC status now.

## Installation
It is not published in the Chrome Web Store yet.

Nothing needs to be built at the moment.
You can load unpacked extension to Chrome in developer mode.

## Usage
It supports few "graph types":
* hierarchy
* graph.

In short the `hierarchy` mode uses different nodes for the same models in different branches. The `graph` uses only 1 node for 1 model.
Let's take a look at 2 examples of models from Ember.js Blog.

### Graph
![Image of Graph](https://github.com/MaxKrai/ember-data-relationships-graph-extension/blob/images/graph.PNG?raw=true)
### Hierarchy
![Image of Graph](https://github.com/MaxKrai/ember-data-relationships-graph-extension/blob/images/hierarchy.PNG?raw=true)

It supports 3 display modes:
* Breadthfirst (preferred for hierarchy)
* Circle
* Concentric Circle

Keep in mind that for `hierarchy` mode it is needed to provide root model name.

As well as in `graph` mode it is possible to use filter string that works as `modelName.includes(filterStr)`. Also you can render a count of actual relationships in this mode (3 links to some model will be rendered as 3 connections).


## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[MIT](https://choosealicense.com/licenses/mit/)