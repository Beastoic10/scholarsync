package com.scholarsync.config;

import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Info;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI scholarSyncOpenApi() {
        return new OpenAPI()
                .info(new Info()
                        .title("ScholarSync API")
                        .version("v0.1")
                        .description("Real-time academic research collaboration and workflow engine"));
    }
}
