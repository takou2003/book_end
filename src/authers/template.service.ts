import { Injectable, Logger } from '@nestjs/common';
import * as handlebars from 'handlebars';
import { readFileSync } from 'fs';
import { join } from 'path';

@Injectable()
export class TemplateService {
  private readonly logger = new Logger(TemplateService.name);
  private templates: Map<string, handlebars.TemplateDelegate> = new Map();

  compile(templateName: string, context: Record<string, any>): string {
    try {
      // Vérifier le cache
      let compiledTemplate = this.templates.get(templateName);

      if (!compiledTemplate) {
        // Chemin absolu vers le template
        const templatePath = join(process.cwd(), 'dist', 'src', 'authers', 'templates', `${templateName}.hbs`);
        
        this.logger.log(`Chargement du template: ${templatePath}`);
        
        // Lire et compiler
        const templateContent = readFileSync(templatePath, 'utf-8');
        compiledTemplate = handlebars.compile(templateContent);
        this.templates.set(templateName, compiledTemplate);
        
        this.logger.log(`Template ${templateName} chargé avec succès`);
      }

      // Générer le HTML
      return compiledTemplate(context);
      
    } catch (error) {
      this.logger.error(`Erreur template: ${error.message}`);
      
      // Template de secours (texte simple)
      return `
        <div style="font-family: Arial; padding: 20px;">
          <h2>BookUp</h2>
          <p>Bonjour ${context.email || 'utilisateur'},</p>
          <p>Votre code est: <strong>${context.code}</strong></p>
          <p>Valable 3 minutes.</p>
        </div>
      `;
    }
  }
}
