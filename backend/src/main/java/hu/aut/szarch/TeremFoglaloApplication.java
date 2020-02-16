package hu.aut.szarch;

import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.builder.SpringApplicationBuilder;
import org.springframework.boot.web.servlet.support.SpringBootServletInitializer;

@SpringBootApplication(scanBasePackages = "hu.aut.szarch")
@Slf4j
public class TeremFoglaloApplication extends SpringBootServletInitializer {

    /**
     * Standalone módban (lokális debugoláskor) futtatáskor ez az alkalamzás belépési pontja.
     * @param args
     */
    public static void main(String[] args) {
        SpringApplication application = new SpringApplication(TeremFoglaloApplication.class);
        application.run(args);
        log.info("Teremfoglalo sikeresen elindult!");
    }

    /**
     * EJB vagy Web konténerben futtatva ez az alkalamzás belépési pontja
     * @param builder
     * @return
     */
    @Override
    protected SpringApplicationBuilder configure(SpringApplicationBuilder builder) {
        return builder.sources(TeremFoglaloApplication.class);
    }
}
