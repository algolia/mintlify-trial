import YAML from 'yaml';
import fs from 'fs';
import nunjucks from 'nunjucks';

const file = fs.readFileSync('.scripts/configure.yml', 'utf8');
const data = YAML.parse(file);

nunjucks.configure({ autoescape: false });

// Data to pass into the component

// Render the component to an HTML string
const template = `---
title: {{ name }}
description: {{ short_description }}
---

import { TabsTs } from '/snippets/instantsearch-widget-api-ref-template.mdx';

<Tabs>
  <Tab title="JS" lang="js">
    ## Signature
    {{ usage.js.signature }}
     
    ## Import
    <CodeGroup>
    {% for import in usage.js.import %}
      {{ import.code }}
    {% endfor %}
    </CodeGroup>
  </Tab>
  <Tab title="React" lang="jsx">
    ## Signature
    {{ usage.react.signature }}
     
    ## Import
    {% if usage.react.import.length === 1 %}
    {% for import in usage.react.import %}
      {{ import.code }}
    {% endfor %}
    {% else %}
    <CodeGroup>
    {% for import in usage.react.import %}
      {{ import.code }}
    {% endfor %}
    </CodeGroup>
    {% endif %}
  </Tab>
  <Tab title="Vue" lang="js">
    ## Signature
    {{ usage.vue.signature }}
     
    ## Import
    <CodeGroup>
    {% for import in usage.vue.import %}
      {{ import.code }}
    {% endfor %}
    </CodeGroup>
  </Tab>
</Tabs>

## About this widget 

{{ description }}

## Examples

<Tabs>
  <Tab title="JS" lang="js">
    {{ examples.js }}  
  </Tab>
  <Tab title="React" lang="jsx"> 
    {{ examples.react }} 
  </Tab>
  <Tab title="Vue" lang="html">
    {{ examples.vue }}
  </Tab>
</Tabs>


{% for group in widget_parameters_groups %} 
| Name                 | Description                  |
|----------------------|------------------------------|
  {% for parameter in group.parameters %} 
| {{ parameter.name }} | {{ parameter.description }}  |
  {% endfor %}
{% endfor %}

## HTML output

{{ html_output }}

## Customize the UI

<Tabs>
  <Tab title="JS">
    If you want to create your own UI of the \`{{ name }}\` widget, you can use connectors.

    To use \`{{ connector_name.js }}\`, you can import it with the declaration relevant to how you installed InstantSearch.js.
    
    <Steps>
      <Step title="Create a render function">
        {{ connector_usage.js.process_step_1 }}
      </Step>
      <Step title="Create the custom widget">
        {{ connector_usage.js.process_step_2 }}
      </Step>
      <Step title="Instantiate">
        {{ connector_usage.js.process_step_3 }}
      </Step>
    </Steps>
  </Tab>
  <Tab title="React">
    React InstantSearch let you create your own UI for the \`{{ name }}\` widget with \`{{ connector_name.react }}\`. Hooks provide APIs to access the widget state and interact with InstantSearch.

    The \`{{ connector_name.react }}\` Hook accepts parameters and returns APIs. It must be used inside the \`<InstantSearch>\` component.
    
    <Steps>
      <Step title="Create a render function">
        {{ connector_usage.react.process_step_1 }}
      </Step>
      <Step title="Create the custom widget">
        {{ connector_usage.react.process_step_2 }}
      </Step>
      <Step title="Instantiate">
        {{ connector_usage.react.process_step_3 }}
      </Step>
    </Steps>
  </Tab>
  <Tab title="Vue">
    If you want to create your own UI of the \`{{ name }}\` widget, you can use slots.
  </Tab>
</Tabs>
`;

const str = nunjucks.renderString(template, data);

fs.writeFile('ui-libraries/instantsearch/widgets/configure.mdx', str, (err) => {
  if (err) console.error(err);
});
