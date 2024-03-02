package com.mally.api.shared.rest.advices;

import com.mally.api.shared.rest.dtos.ApiResponseDTO;
import jakarta.validation.ConstraintViolation;
import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import java.util.ArrayList;
import java.util.List;

@ControllerAdvice
class ErrorHandlingControllerAdvice {

    @ExceptionHandler(ConstraintViolationException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    ApiResponseDTO onConstraintValidationException(ConstraintViolationException e) {
        List<String> error = new ArrayList<>();

        for (ConstraintViolation violation : e.getConstraintViolations()) {
            error.add(violation.getPropertyPath().toString() + ' ' + violation.getMessage());
        }

        return ApiResponseDTO.error("Validation error", error);
    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    @ResponseStatus(HttpStatus.BAD_REQUEST)
    @ResponseBody
    ApiResponseDTO onMethodArgumentNotValidException(
            MethodArgumentNotValidException e) {
        List<String> error = new ArrayList<>();

        for (FieldError fieldError : e.getBindingResult().getFieldErrors()) {
            error.add(fieldError.getField() + ' ' + fieldError.getDefaultMessage());
        }

        return ApiResponseDTO.error("Validation error", error);
    }

}
