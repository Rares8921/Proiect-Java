package com.example.ihas.aop;

import java.lang.annotation.*;

@Retention(RetentionPolicy.RUNTIME)
@Target(ElementType.METHOD) // Punem adnotarea asta pe metode cu log-ul respectiv!
public @interface Audit {
    String value();  // un text care descrie acțiunea
}
