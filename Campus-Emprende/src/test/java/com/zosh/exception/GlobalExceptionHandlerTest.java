package com.zosh.exception;

import org.junit.jupiter.api.Test;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import static org.hamcrest.Matchers.containsString;
import static org.hamcrest.Matchers.not;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

class GlobalExceptionHandlerTest {

    private final MockMvc mockMvc = MockMvcBuilders
            .standaloneSetup(new FailingController())
            .setControllerAdvice(new GlobalExceptionHandler())
            .build();

    @Test
    void validationStyleErrorReturns400Payload() throws Exception {
        mockMvc.perform(get("/test/illegal").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.message").value("Parametro invalido"))
                .andExpect(jsonPath("$.path").value("/test/illegal"));
    }

    @Test
    void generalErrorDoesNotExposeStackTrace() throws Exception {
        mockMvc.perform(get("/test/general").accept(MediaType.APPLICATION_JSON))
                .andExpect(status().isInternalServerError())
                .andExpect(jsonPath("$.status").value(500))
                .andExpect(jsonPath("$.message").value("Se produjo un error interno al procesar la solicitud"))
                .andExpect(content().string(not(containsString("stacktrace interno"))));
    }

    @RestController
    @RequestMapping("/test")
    static class FailingController {

        @GetMapping("/illegal")
        String illegal() {
            throw new IllegalArgumentException("Parametro invalido");
        }

        @GetMapping("/general")
        String general() {
            throw new RuntimeException("stacktrace interno");
        }
    }
}
