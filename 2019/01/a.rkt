#lang racket
(define in (open-input-file "input"))
;(define in (open-input-file "example"))

 (define lines_s (in-lines in))
;(sequence-map 
; (lambda (v) (display v))
; lines_s
;)

 (define lines_list (sequence->list lines_s))
 
 (define fuels 
 (map
  (lambda(s) 
    (let* (
        [n (string->number s)]
        [div3 (/ n 3)]
        [floored (truncate div3)]
      )
      (- floored 2)
    )
  )
  lines_list
))

;(take fuels 10)
(define result (foldl + 0 fuels))
;(send the-clipboard set-clipboard-string result)
