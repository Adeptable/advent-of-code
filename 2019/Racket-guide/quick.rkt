    #lang slideshow
(define c (circle 10))
(define r (rectangle 10 20))
(define (square n) ;comment
  (filled-rectangle n n))
(define (checker2 s c1 c2)
  (let ([p1 (colorize (square s) c1)]
        [p2 (colorize (square s) c2)])
      (vc-append (hc-append p1 p2) (hc-append p2 p1))))
(define (checker p1 p2) (vc-append (hc-append p1 p2) (hc-append p2 p1)))
(define (four p)
  (define two-p (hc-append p p))
  (vc-append two-p two-p))
(define (checkerboard p)
  (let* ([rp (colorize p "red")]
         [bp (colorize p "black")]
         [c (checker rp bp)]
         [c4 (four c)])
    (four c4)))


(define (series mk)
  (hc-append 4 (mk 5) (mk 10) (mk 20)))

(define (rgb-series mk)
  (vc-append
   (series (lambda (sz) (colorize (mk sz) "red")))
   (series (lambda (sz) (colorize (mk sz) "green")))
   (series (lambda (sz) (colorize (mk sz) "blue")))))

(define (rgb-maker mk)
  (lambda (sz)
    (vc-append (colorize (mk sz) "red")
               (colorize (mk sz) "green")
               (colorize (mk sz) "blue"))))

(define (rainbow p)
  (map (lambda (color)
         (colorize p color))
       (list "red" "orange" "yellow" "green" "blue" "indigo" "purple")))
(provide rainbow square)

(require slideshow/code)
(define-syntax pict+code
  (syntax-rules ()
    [(pict+code expr)
     (hc-append 10
                expr
                (code expr))]))

(require racket/class
         racket/gui/base)

(define f (new frame% [label "My Art"]
                      [width 300]
                      [height 300]
                      [alignment '(center center)]))

(define (add-drawing p)
  (let ([drawer (make-pict-drawer p)])
    (new canvas% [parent f]
                 [style '(border)]
                 [paint-callback (lambda (self dc)
                                   (drawer dc 0 0))])))

 (send f show #t)

(require pict/flash)