package com.example.ihas.aop;

import com.example.ihas.services.AuditService;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.springframework.stereotype.Component;

@Aspect
@Component
public class AuditAspect {

    private final AuditService auditService;

    public AuditAspect(AuditService _auditService) {
        auditService = _auditService;
    }

    // Interceptam orice functie ce are adnotarea noastra
    @Around("@annotation(auditAnnotation)")
    public Object auditAdvice(ProceedingJoinPoint joinPoint, Audit auditAnnotation) throws Throwable {
        // extragem actiunea
        String actionName = auditAnnotation.value();

        // lasam sa se execute functia ce are adnotarea
        Object result = joinPoint.proceed();
        auditService.logAction(actionName);

        return result;
    }
}
