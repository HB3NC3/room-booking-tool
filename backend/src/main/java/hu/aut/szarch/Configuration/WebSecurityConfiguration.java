package hu.aut.szarch.Configuration;


import hu.aut.szarch.Authentication.Service.JwtEncryptor;
import hu.aut.szarch.Authentication.Service.Token.JwtFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@EnableWebSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
@Configuration
public class WebSecurityConfiguration extends WebSecurityConfigurerAdapter {

    private JwtEncryptor jwtEncryptor;

    private String jwtSigningKey;

    public WebSecurityConfiguration(JwtEncryptor jwtEncryptor, @Value("${aut.security.jwt.signing-key}") String jwtSigningKey) {
        super(true);
        this.jwtEncryptor = jwtEncryptor;
        this.jwtSigningKey = jwtSigningKey;
    }

    @Override
    protected void configure(HttpSecurity http) throws Exception {
        http
                .exceptionHandling().and()
                .anonymous().and()
                .servletApi().and()
                .authorizeRequests()

                // Allow anonymous resource requests
                .antMatchers("/").permitAll()
                .antMatchers("/favicon.ico").permitAll()

                // Allow anonymous registers
                .antMatchers("/system-user/register").permitAll()

                //Allow logins
                .antMatchers("/system-user/login").permitAll()

                .antMatchers(HttpMethod.GET,"/room").permitAll()

                .antMatchers(HttpMethod.GET, "/event").permitAll()

                //Naptár időköz bárkinek lehet
                .antMatchers("/event/interval").permitAll()

                .antMatchers("/event/interval/**").permitAll()

                // Allow public apis
                .antMatchers("/public/**").permitAll()

                // Allow metrics
                .antMatchers("/actuator/**").permitAll()

                //Allow swagger and springfox
                .antMatchers("/swagger-resources/**", "/swagger-ui.html", "/webjars/springfox-swagger-ui/**", "/v2/api-docs**", "/swagger**").permitAll()

                //Allow pre-flight cors
                .antMatchers(HttpMethod.OPTIONS).permitAll()

                // All other request need to be authenticated
                .anyRequest().authenticated().and()

                // Custom Token based authentication based on the header previously given to the client
                .addFilterBefore(new JwtFilter(jwtEncryptor, jwtSigningKey), UsernamePasswordAuthenticationFilter.class);
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

}