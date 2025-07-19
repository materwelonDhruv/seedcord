// eslint-disable-next-line import/no-cycle
import { Envuments } from '../Envuments';

export class Parser {
  private readonly TEMPLATE_REGEX = /\${\w*}/g;

  private escapeRegexChars(str: string): string {
    return str.replace(/([.*+?^=!:${}()|[\]/\\])/g, '\\$1');
  }

  resolveValueString(key: string, value: string): string {
    const templates = value.match(this.TEMPLATE_REGEX);
    if (!templates) return value;

    for (const template of templates) {
      const variable = template.slice(2, -1);
      if (!variable || variable === key) continue; // Prevent any circulars

      const variableVal = Envuments.get(variable);

      value = value.replace(new RegExp(this.escapeRegexChars(template), 'g'), variableVal || template);
    }

    return value;
  }
}
