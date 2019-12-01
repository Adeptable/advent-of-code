#lang racket
(define in (open-input-file "input"))
;(define in (open-input-file "example"))

 (define lines_s (in-lines in))
 (define lines_list (sequence->list lines_s))
 (define lines_list_num (map string->number lines_list))
 
 (define (fuel_to_carry module_weight)
  (let* (
        ;[n (if (number? module_weight) module_weight (string->number module_weight))]
        ;[div3 (/ n 3)]
        [div3 (/ module_weight 3)]
        [floored (truncate div3)]
      )
      (- floored 2)
    )
)

(define (total_fuel module_weight)
  (let ([this_fuel (fuel_to_carry module_weight)])
    (match this_fuel
      [(or 0 -1 -2) 0]
      [_ (+ this_fuel (total_fuel this_fuel))]
    )
  )
)

 (define fuels 
 (map
  (lambda(s) 
    (let* (
        [n (string->number s)]
      )
      (total_fuel n)
    )
  )
  lines_list
))

;(display "expected: ") (display (list 2 2 654 33583)) (newline)
;(display "expected: ") (display (list 2 2 966 50346)) (newline)
;(display "actual:   ") (display fuels) (newline)
(define result (foldl + 0 fuels))
(display result)(newline)
(require racket/gui/base)
(send the-clipboard set-clipboard-string (number->string result) 0)
