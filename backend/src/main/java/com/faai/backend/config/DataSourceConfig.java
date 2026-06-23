package com.faai.backend.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.jdbc.DataSourceBuilder;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Primary;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.DriverManager;

@Configuration
public class DataSourceConfig {

    @Value("${spring.datasource.url}")
    private String mysqlUrl;

    @Value("${spring.datasource.username}")
    private String mysqlUsername;

    @Value("${spring.datasource.password}")
    private String mysqlPassword;

    @Bean
    @Primary
    public DataSource dataSource() {
        try {
            System.out.println("Attempting to connect to MySQL database at: " + mysqlUrl);
            // Quick test connection to see if credentials are valid and server is up
            try (Connection conn = DriverManager.getConnection(mysqlUrl, mysqlUsername, mysqlPassword)) {
                System.out.println("Successfully connected to MySQL database!");
            }
            return DataSourceBuilder.create()
                    .url(mysqlUrl)
                    .username(mysqlUsername)
                    .password(mysqlPassword)
                    .driverClassName("com.mysql.cj.jdbc.Driver")
                    .build();
        } catch (Exception e) {
            System.out.println("MySQL connection failed: " + e.getMessage());
            System.out.println("Falling back to in-memory H2 database for smooth development flow...");
            return DataSourceBuilder.create()
                    .url("jdbc:h2:mem:agri;DB_CLOSE_DELAY=-1;MODE=MySQL")
                    .username("sa")
                    .password("")
                    .driverClassName("org.h2.Driver")
                    .build();
        }
    }
}
