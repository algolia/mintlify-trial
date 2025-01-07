import YAML from "yaml";
import fs from 'fs';
import nunjucks from 'nunjucks';

const file = fs.readFileSync('.scripts/configure.yml', 'utf8')
const data = YAML.parse(file);


nunjucks.configure({ autoescape: false });


// Data to pass into the component


// Render the component to an HTML string
const template = `---
title: {{ name }}
description: {{ short_description }}
---

import { TabsTs } from '/snippets/instantsearch-widget-api-ref-template.mdx';

## About this widget 
{{ description }}

## Usage

<Tabs>
  <Tab title="JS" lang="js">
\`\`\`js
{{ usage }} \`\`\`
</Tab>
  <Tab title="React" lang="js">
\`\`\`js
{{ usage_react }} \`\`\`
</Tab>
  <Tab title="Vue" lang="js">
\`\`\`js
{{ usage_vue }} \`\`\`
</Tab>
  </Tabs>
  
  

## Examples

<TabsTs>
  <Tab title="JS" lang="js">
{{ examples }}  
  </Tab>
  <Tab title="React (js)" lang="js"> 
{{ examples }} 
  </Tab>
  <Tab title="Vue (js)" lang="js">
{{ examples }}
  </Tab>
</TabsTs>


{% for group in widget_parameters_groups %} 
| Options |   d  |
|---------|-------------| {% for parameter in group.parameters %} 
 | {{ parameter.name }} | {{ parameter.description }}  |
 {% endfor %}
{% endfor %}


## HTML output



{{ html_output }}

## Customize the UI


If you want to create your own UI of the \`{{ name }}\` widget, you can use connectors.

To use  \`{{ connector_name }}\`, you can import it with the declaration relevant to how you installed InstantSearch.js.


<Steps>
  <Step title="Create a render function">
<TabsTs>
  <Tab title="JS" lang="js">
{{ connector_usage.process_step_1 }}
  </Tab>
  <Tab title="React" lang="js"> 
{{ connector_usage.process_step_1 }}
  </Tab>
  <Tab title="Vue" lang="js">
{{ connector_usage.process_step_1 }}
  </Tab>
</TabsTs>
  </Step>
  <Step title="Create the custom widget">
{{ connector_usage.process_step_2 }}
  </Step>
  <Step title="Instantiate">
{{ connector_usage.process_step_3 }}
  </Step>
</Steps>
`;


const str = nunjucks.renderString(template, data);

fs.writeFile('ui-libraries/instantsearch/widgets/configure.mdx', str, err => {
    if (err)
      console.error(err)

});