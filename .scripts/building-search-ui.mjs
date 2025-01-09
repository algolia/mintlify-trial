import YAML from 'yaml';
import fs from 'fs';
import path from 'path';
import nunjucks from 'nunjucks';

const directory = '.scripts/widgets/';

const files = fs.readdirSync('.scripts/widgets/').flatMap((widget) => {
  return fs.readdirSync(path.join(directory, widget)).map((flavor) => {
    return {
      flavor: flavor.replace('.yml', ''),
      widget,
      file: fs.readFileSync(path.join(directory, widget, flavor), 'utf8'),
    };
  });
});

nunjucks.configure({ autoescape: false });

files.forEach(({ flavor, widget, file }) => {
  const data = YAML.parse(file);

  const template = `---
title: {{ name }}
description: {{ short_description }}
---

## Signature

{{ usage }}
 
## Import

{% if flavor === 'js' %}
<CodeGroup>
\`\`\`js With a package manager
import { {{ import }} } from 'instantsearch.js/es/widgets';
\`\`\`

\`\`\`js With a CDN
const { {{ import }} } = instantsearch.widgets;
// or directly use instantsearch.widgets.{{ import }}()
\`\`\`
</CodeGroup>
{% elif flavor === 'react' %}
\`\`\`jsx
import { {{ import }} } from 'react-instantsearch';
\`\`\`
{% elif flavor === 'vue' %}
<CodeGroup>
\`\`\`js Component
import { {{ import }} } from 'vue-instantsearch';
// Use 'vue-instantsearch/vue3/es' for Vue 3

export default {
  components: {
    {{ import }}
  },
  // ...
};
\`\`\`

\`\`\`js Via a plugin
import Vue from 'vue';
import InstantSearch from 'vue-instantsearch';
// Use 'vue-instantsearch/vue3/es' for Vue 3

Vue.use(InstantSearch);
\`\`\`
</CodeGroup>
{% endif %}

- [See code examples](#examples)
- [See live example]({{ storybook_link }})

## About this widget

{{ description }}
 
## Examples

{{ examples }}

{% for group in widget_parameters_groups %}
## {{ group.name }}

{% for parameter in group.parameters %}
<ParamField path="{{ parameter.name }}" type="{{ parameter.type }}" required="{{ parameter.required }}">
{{ parameter.description }}
{{ parameter.snippets }}
</ParamField>
{% endfor %}
{% endfor %}

## {{ customize.title }}

{% if flavor === 'js' %}

If you want to create your own UI of the configure widget, you can use connectors.

To use \`{{ customize.connector.name }}\`, you can import it with the declaration relevant to how you installed the library.

<CodeGroup>
\`\`\`js With a package manager
import { {{ customize.connector.name }} } from 'instantsearch.js/es/connectors';
\`\`\`

\`\`\`js With a CDN
const { {{ customize.connector.name }} } = instantsearch.widgets;
// or directly use instantsearch.widgets.{{ customize.connector.name }}()
\`\`\`
</CodeGroup>

### Create a render function

This rendering function is called before the first search (\`init\` lifecycle step) and each time results come back from Algolia (\`render\` lifecycle step).

{{ customize.connector.usage.renderFunction }}
 
#### {{ customize.connector.params[0].name }}

{% for parameter in customize.connector.params[0].parameters %}
<ParamField path="{{ parameter.name }}" type="{{ parameter.type }}" required="{{ parameter.required }}">
{{ parameter.description }}
{{ parameter.snippets }}
</ParamField>
{% endfor %}

### Create and instantiate the custom widget

We first create custom widgets from our rendering function, then we instantiate them. When doing that, there are two types of parameters you can give:

- Instance parameters: they are predefined parameters that you can use to configure the behavior of Algolia.
- Your own parameters: to make the custom widget generic.

Both instance and custom parameters are available in \`connector.widgetParams\`, inside the \`renderFunction\`.

{{ customize.connector.usage.initializeWidget }}
 
#### {{ customize.connector.params[1].name }}

{% for parameter in customize.connector.params[1].parameters %}
<ParamField path="{{ parameter.name }}" type="{{ parameter.type }}" required="{{ parameter.required }}">
{{ parameter.description }}
{{ parameter.snippets }}
</ParamField>
{% endfor %}

{% elif flavor === 'react' %}

The library let you create your own UI for the \`{{ name }}\` widget with \`{{ customize.connector.name }}\`. Hooks provide APIs to access the widget state and interact with InstantSearch.

The \`{{ customize.connector.name }}\` Hook accepts parameters and returns APIs. It must be used inside the \`<InstantSearch>\` component.

### Usage

First, create your React component:

{{ customize.connector.usage.renderFunction }}

Then, render the widget:

{{ customize.connector.usage.initializeWidget }}
 
### Parameters

Hooks accept parameters. You can pass them manually, or forward the props from your custom component.

<Note>
When you provide a function to Hooks, make sure to pass a stable reference to avoid rendering endlessly (for example, with [\`useCallback()\`](https://reactjs.org/docs/hooks-reference.html#usecallback)). Objects and arrays are memoized; you don’t need to stabilize them.
</Note>

{% for parameter in customize.connector.params[0].parameters %}
<ParamField path="{{ parameter.name }}" type="{{ parameter.type }}" required="{{ parameter.required }}">
{{ parameter.description }}
{{ parameter.snippets }}
</ParamField>
{% endfor %}

### APIs

Hooks return APIs, such as state and functions. You can use them to build your UI and interact with React InstantSearch.

{% for parameter in customize.connector.params[1].parameters %}
<ParamField path="{{ parameter.name }}" type="{{ parameter.type }}" required="{{ parameter.required }}">
{{ parameter.description }}
{{ parameter.snippets }}
</ParamField>
{% endfor %}
 
{% elif flavor === 'vue' %}

If you want to create your own UI of the \`{{ name }}\` widget, you can use slots.

{% for group in customize.connector.params %}
{% for parameter in group.parameters %}
<ParamField path="{{ parameter.name }}" type="{{ parameter.type }}" required="{{ parameter.required }}">
{{ parameter.description }}
{{ parameter.snippets }}
</ParamField>
{% endfor %}
{% endfor %}

{% endif %}

{% if (flavor === 'js') or (flavor === 'react') %}

### Full example

<CodeGroup>
{% for snippet in customize.connector.full_example %}
{{ snippet.code }}
{% endfor %}
</CodeGroup>

{% endif %}

## HTML Output

{{ html_output }}
`;

  const str = nunjucks.renderString(template, { ...data, flavor });

  fs.writeFile(
    `ui-libraries/instantsearch/widgets/${flavor}/${widget}.mdx`,
    str,
    (err) => {
      if (err) {
        console.error(err);
      }
    }
  );
});
