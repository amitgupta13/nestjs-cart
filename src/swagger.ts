import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

export default (app) => {
  const config = new DocumentBuilder()
    .setTitle('Shopping Card API')
    .setDescription('Shopping Card API')
    .setVersion('1.0')
    .addTag('Shopping Card')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
};
