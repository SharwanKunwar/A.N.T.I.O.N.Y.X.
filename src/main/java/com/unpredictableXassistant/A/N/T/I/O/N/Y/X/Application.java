package com.unpredictableXassistant.A.N.T.I.O.N.Y.X;

import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class Application
{
	public static void main(String[] args)
	{
		Dotenv dotenv = Dotenv.configure().ignoreIfMissing().load();
		System.setProperty("DB_URL", dotenv.get("DB_URL"));
		System.setProperty("DB_USERNAME", dotenv.get("DB_USERNAME"));
		System.setProperty("DB_PASSWORD", dotenv.get("DB_PASSWORD"));
		System.setProperty("OPENROUTER_API_KEY", dotenv.get("OPENROUTER_API_KEY"));
		System.setProperty("AI_URL", dotenv.get("AI_URL"));
		System.setProperty("AI_SYSTEM_INSTRUCTION", dotenv.get("AI_SYSTEM_INSTRUCTION"));

		SpringApplication.run(Application.class, args);
		System.out.println("System is ready to jump.");
	}

}
