import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { EnvService } from './infra/env/env.service'
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger'

async function bootstrap() {
  const app = await NestFactory.create(AppModule)

  const config = new DocumentBuilder()
    .setTitle('Workee API')
    .setDescription('API para o Marketplace de serviços e orçamentos Workee.')
    .setVersion('1.0')
    .addBearerAuth()
    .build()
  const document = SwaggerModule.createDocument(app, config)
  SwaggerModule.setup('api', app, document)

  const envService = app.get(EnvService)
  const port = envService.get('PORT')

  await app.listen(port)
}
bootstrap()
