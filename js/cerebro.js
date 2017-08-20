const REDONDO = 'O', CRUZ = 'X'

var ficha = CRUZ,
cantCeldasPulsadas = 0,
itemSelec = 0,
comienza = 'hum'
terminarJuego = false,
tablero = new Array (new Array (3), new Array (3), new Array (3))

$(document).ready (function () {
    crearTablero ()
    $('td').on('click', celdaPulsada)
    $('#btnJugarDeNuevo').on ('click', jugarDeNuevo)
    $('select').change (function () {
        itemSelec = parseInt($("select option:selected").val ())
    })
})

function crearTablero () {
    var f = 0, c = 0
    $('tr td').each ((index, value) => {
        tablero [f][c] = $(value)

        if (c == 2) {
            f ++
            c = 0
        
        } else {
            c ++
        }
    })
}

var celdaPulsada = function () {
    var element = $(this)

    //Se obtiene la posición pulsada.
    var posc = element.attr ('data-colum').split (',')
    actualizarCelda (posc [0], posc [1])

    if (itemSelec != 3 && !terminarJuego) determinarNivelDeMaq ()
}

function actualizarCelda (fila, colum) {
    cantCeldasPulsadas ++
    tablero [fila][colum].text (ficha)
    tablero [fila][colum].off ('click')

    if (ficha == CRUZ) {
        ficha = REDONDO
        tablero [fila][colum].css ('color', 'green')

    } else {
        ficha = CRUZ
        tablero [fila][colum].css ('color', 'red')
    }
    determinarResultado ()
}

var jugarDeNuevo = () => {
    if (terminarJuego) $('td').on ('click', celdaPulsada)
    for (var fila of tablero) {
        for (var e of fila) {
            if (e.text ()) {
                if (!terminarJuego) e.on ('click', celdaPulsada)
                e.text (null)
            }
        }
    }

    if (terminarJuego) {
        comienza = comienza == 'hum' ? 'maq' : 'hum'
    }
    
    terminarJuego = false
    cantCeldasPulsadas = 0
    ficha = CRUZ

    if (comienza == 'maq') {
        elegirCeldaAlAzar ()
    }
}

var hayGanador = function () {
    for (var i = 0; i < 3; i ++) {
        fila = tablero [i]

        //Horizontal.
        if (fila [0].text() && fila [1].text() && fila [2].text()) {
            if (fila [0].text() == fila [1].text() && fila [1].text() == fila [2].text()) {
                return fila [0].text();
            }
        }

        //Vertical.
        if (tablero [0][i].text() && tablero [1][i].text() && tablero [2][i].text()) {
            if (tablero [0][i].text() == tablero [1][i].text() && tablero [1][i].text() == tablero [2][i].text())
                return tablero [0][i].text();
        }
    }

    if (tablero [0][0].text() && tablero [1][1].text() && tablero [2][2].text()) {
        if (tablero [0][0].text() == tablero [1][1].text() && tablero [1][1].text() == tablero [2][2].text())
            return tablero [0][0].text();
    }

    if (tablero [0][2].text() && tablero [1][1].text() && tablero [2][0].text()) {
        if (tablero [0][2].text() == tablero [1][1].text() && tablero [1][1].text() == tablero [2][0].text())
            return tablero [0][2].text();
    }

    return null;
}

function amenazaSimple () {
    var f, c

    for (var i = 0; i < 3; i ++) {
        var fila = tablero [i]

        //Izquierda-Centro y Centro-Derecha.
        if (fila [1].text()) {
            if (!fila [2].text() && fila [0].text() && fila [0].text() == fila [1].text()) {
                if (fila [0].text () == ficha) {
                    actualizarCelda (i, 2)
                    return true

                } else {
                   f = i, c = 2 
                }
            }

            if (!fila [0].text() && fila [2].text() && fila [2].text() == fila [1].text()) {
                if (fila [1].text () == ficha) {
                    actualizarCelda (i, 0)
                    return true
                    
                } else {
                   f = i, c = 0 
                }
            }
        }

        //Izquierda-Derecha.
        if (!fila [1].text() && fila [0].text() && fila [2].text()) {
            if (fila [0].text() == fila [2].text()) {
                if (fila [0].text () == ficha) {
                    actualizarCelda (i, 1)
                    return true
                    
                } else {
                   f = i, c = 1 
                }
            }
        }

        //Vertical.
        //Abajo-Centro y Centro-Arriba.
        if (tablero [1][i].text()) {
            if (tablero [2][i].text() && !tablero [0][i].text() && tablero [2][i].text() == tablero [1][i].text()) {
                if (tablero [2][i].text() == ficha) {
                    actualizarCelda (0, i)
                    return true
                    
                } else {
                   f = 0, c = i
                }
            }

            if (tablero [0][i].text() && !tablero [2][i].text() && tablero [0][i].text() == tablero [1][i].text()) {
                if (tablero [0][i].text() == ficha) {
                    actualizarCelda (2, i)
                    return true
                    
                } else {
                   f = 2, c = i
                }
            }
        }

        //Abajo-Arriba.
        if (!tablero [1][i].text() && tablero [0][i].text() && tablero [2][i].text()) {
            if (tablero [0][i].text() == tablero [2][i].text()) {
                if (tablero [0][i].text() == ficha) {
                    actualizarCelda (1, i)
                    return true
                    
                } else {
                   f = 1, c = i
                }
            }
        }
    }

    if (tablero [1][1].text()) {
        if (tablero [0][0].text() && !tablero [2][2].text() && tablero [0][0].text() == tablero [1][1].text()) {
            if (tablero [0][0].text() == ficha) {
                actualizarCelda (2, 2)
                return true
                    
            } else {
                f = c = 2
            }

        } else if (tablero [0][2].text() && !tablero [2][0].text() && tablero [0][2].text() == tablero [1][1].text()) {
            if (tablero [0][2].text() == ficha) {
                    actualizarCelda (2, 0)
                    return true
                    
                } else {
                   f = 2, c = 0
                }

        } else if (tablero [2][2].text() && !tablero [0][0].text() && tablero [2][2].text() == tablero [1][1].text()) {
            if (tablero [2][2].text() == ficha) {
                actualizarCelda (0, 0)
                return true
                    
            } else {
                f = c = 0
            }

        } else if (tablero [2][0].text() && !tablero [0][2].text() && tablero [2][0].text() == tablero [1][1].text()) {
            if (tablero [2][0].text() == ficha) {
                    actualizarCelda (0, 2)
                    return true
                    
                } else {
                   f = 0, c = 2
                }
        }
    }

    if (!tablero [1][1].text()) {
        if (tablero [0][0].text () && tablero [2][2].text ()) {
            if (tablero [0][0].text () == tablero [2][2].text ()) {
                if (tablero [2][2].text() == ficha) {
                    actualizarCelda (1, 1)
                    return true
                    
                } else {
                   f = c = 1
                }
            }

        } 
        if (tablero [0][2].text () && tablero [2][0].text ()) {
            if (tablero [0][2].text () == tablero [2][0].text ()) {
                if (tablero [2][0].text() == ficha) {
                    actualizarCelda (1, 1)
                    return true
                    
                } else {
                   f = c = 1
                }
            }
        }
    }

    if (f != undefined && c != undefined) {
        actualizarCelda (f, c)
        return true
    }

    return false
}

function amenazaDoble () {
    if (tablero [0][0].text() && tablero [1][1].text() && tablero [2][2].text()) {
        //Amenaza 1.
        if (tablero [0][0].text() == ficha && tablero [1][1].text() != ficha && tablero [2][2].text() != ficha ||
        tablero [0][0].text() != ficha && tablero [1][1].text() != ficha && tablero [2][2].text() == ficha) {
            seleccionarCelda (['0,2', '2,0'])
            return true
        }

        //Amenaza 2
        if (tablero [0][0].text() != ficha && tablero [1][1].text() == ficha && tablero [2][2].text() != ficha) {
            seleccionarCelda (['0,1', '1,0', '1,2', '2,1'])
            return true
        }
    }
    
    if (tablero [0][2].text() && tablero [1][1].text() && tablero [2][0].text()) {
        //Amenaza 1.
        if (tablero [0][2].text() == ficha && tablero [1][1].text() != ficha && tablero [2][0].text() != ficha ||
        tablero [0][2].text() != ficha && tablero [1][1].text() != ficha && tablero [2][0].text() == ficha) {
            seleccionarCelda (['0,0', '2,2'])
            return true
        }

        //Amenaza 2.
        if (tablero [0][2].text() != ficha && tablero [1][1].text() == ficha && tablero [2][0].text() != ficha) {
            seleccionarCelda (['0,1', '1,0', '1,2', '2,1'])
            return true
        }
    }

    //Amenaza 3.
    if (tablero [1][0].text() && tablero [2][2].text() && tablero [1][0].text() != ficha && tablero [2][2].text() != ficha) {
        seleccionarCelda (['0,0', '0,1', '2,0', '2,1'])
        return true
    }

    if (tablero [0][1].text() && tablero [2][0].text() && tablero [0][1].text() != ficha && tablero [2][0].text() != ficha) {
        seleccionarCelda (['0,0', '0,2', '1,0', '1,2'])
        return true
    }

    if (tablero [0][0].text() && tablero [1][2].text() && tablero [0][0].text() != ficha && tablero [1][2].text() != ficha) {
        seleccionarCelda (['0,1', '0,2', '2,1', '2,2'])
        return true
    }

    if (tablero [0][2].text() && tablero [2][1].text() && tablero [0][2].text() != ficha && tablero [2][1].text() != ficha) {
        seleccionarCelda (['1,0', '1,2', '2,0', '2,2'])
        return true
    }

    if (tablero [0][1].text() && tablero [2][2].text() && tablero [0][1].text() != ficha && tablero [2][2].text() != ficha) {
        seleccionarCelda (['0,0', '0,2', '1,0', '1,2'])
        return true
    }

    if (tablero [1][0].text() && tablero [0][2].text() && tablero [1][0].text() != ficha && tablero [0][2].text() != ficha) {
        seleccionarCelda (['0,0', '0,1', '2,0', '2,1'])
        return true
    }

    if (tablero [1][2].text() && tablero [2][0].text() && tablero [1][2].text() != ficha && tablero [2][0].text() != ficha) {
        seleccionarCelda (['0,1', '0,2', '2,1', '2,2'])
        return true
    }

    if (tablero [0][0].text() && tablero [2][1].text() && tablero [0][0].text() != ficha && tablero [2][1].text() != ficha) {
        seleccionarCelda (['1,0', '1,2', '2,0', '2,2'])
        return true
    }

    //Amenaza 4.
    if (tablero [1][0].text() && tablero [2][1].text() && tablero [1][0].text() != ficha && tablero [2][1].text() != ficha) {
        seleccionarCelda (['0,0', '2,0', '2,2'])
        return true
    }

    if (tablero [0][1].text() && tablero [1][0].text() && tablero [0][1].text() != ficha && tablero [1][0].text() != ficha) {
        seleccionarCelda (['0,0', '0,2', '2,0'])
        return true
    }
    
     if (tablero [0][1].text() && tablero [1][2].text() && tablero [0][1].text() != ficha && tablero [1][2].text() != ficha) {
        seleccionarCelda (['0,0', '0,2', '2,2'])
        return true
    }
    
    if (tablero [1][2].text() && tablero [2][1].text() && tablero [1][2].text() != ficha && tablero [2][1].text() != ficha) {
        seleccionarCelda (['0,2', '2,0', '2,2'])
        return true
    }

    return false
}

function determinarResultado () {
    if (cantCeldasPulsadas > 4) {
        var gano = hayGanador ()
        if (gano) {
            terminarJuego = true
            alert ('¡Ha ganado la ' + gano + '!')
            if (cantCeldasPulsadas != 9) $('td').off ('click')

        } else if (cantCeldasPulsadas == 9) {
            terminarJuego = true
            alert ("Esto es un empate.")
        }
    }
}

function determinarNivelDeMaq () {
    if (itemSelec == 1 || itemSelec == 2) {
        if (cantCeldasPulsadas == 1) {
            if (tablero [1][1].text()) {
                if (tablero [1][1].text() != ficha) {
                    seleccionarCelda (['0,0', '0,2', '2,0', '2,2'])
                    return
                }
            } else {
                seleccionarCelda (['1,1'])
                return
            }
        }
        if (cantCeldasPulsadas > 2 && amenazaSimple ()) return
    }
    if (comienza == 'maq') {
        if (cantCeldasPulsadas == 2) {
            if (generarAmenazaDoble ()) return

        }
    }

    if (itemSelec == 2) {
        if (cantCeldasPulsadas > 2 && cantCeldasPulsadas < 6 && amenazaDoble ()) return
    }

    if (cantCeldasPulsadas != 9) elegirCeldaAlAzar ()
}

function elegirCeldaAlAzar () {
    var f, c
    do {
        f = parseInt (Math.random () * 3)
        c = parseInt (Math.random () * 3)

    } while (tablero [f][c].text())

    actualizarCelda (f, c)
}

function seleccionarCelda (posc) {
    var i = parseInt (Math.random () * posc.length)
    var posc = posc [i].split(',')
    actualizarCelda (posc [0], posc [1])
}

function generarAmenazaDoble () {
    var posc = []

    //Amenaza 1.
    if (tablero [1][0].text () == ficha) {
        if (!tablero [0][1].text ()) {
            posc.push ('0,1')
        }

        if (!tablero [2][1].text ()) {
            posc.push ('2,1')
        }

    } else if (tablero [0][1].text () == ficha) {
        if (!tablero [1][0].text ()) {
            posc.push ('1,0')
        }

        if (!tablero [1][2].text ()) {
            posc.push ('1,2')
        }

    } else if (tablero [1][2].text () == ficha) {
        if (!tablero [0][1].text ()) {
            posc.push ('0,1')
        }

        if (!tablero [2][1].text ()) {
            posc.push ('2,1')
        }
        
    } else if (tablero [2][1].text () == ficha) {
        if (!tablero [1][0].text ()) {
            posc.push ('1,0')
        }

        if (!tablero [1][2].text ()) {
            posc.push ('1,2')
        }
    }

    //Amenaza 2.
    if (tablero [1][1].text () && tablero [1][1].text () != ficha) {
        if (tablero [0][0].text () == ficha) {
            posc.push ('2,2')

        } else if (tablero [2][2].text () == ficha) {
            posc.push ('0,0')

        } else if (tablero [2][0].text () == ficha) {
            posc.push ('0,2')

        } else if (tablero [0][2].text () == ficha) {
            posc.push ('2,0')
        }
    }

    //Amenaza 3.
    if (tablero [1][1].text () == ficha) {
        if (tablero [0][0].text () && tablero [0][0].text () != ficha) {
            posc.push ('2,2')

        } else if (tablero [0][2].text () && tablero [0][2].text () != ficha) {
            posc.push ('2,0')

        } else if (tablero [2][0].text () && tablero [2][0].text () != ficha) {
            posc.push ('0,2')

        } else if (tablero [2][2].text () && tablero [2][2].text () != ficha) {
            posc.push ('0,0')
        }

    } else if (tablero [0][0].text () && tablero [0][0].text () != ficha && tablero [2][2].text () == ficha ||
        tablero [0][2].text () && tablero [0][2].text () != ficha && tablero [2][0].text () == ficha ||
        tablero [2][0].text () && tablero [2][0].text () != ficha && tablero [0][2].text () == ficha ||
        tablero [2][2].text () && tablero [2][2].text () != ficha && tablero [0][0].text () == ficha) {

        posc.push ('1,1')
    } 

    //Amenaza 4.
    if (tablero [1][0].text() == ficha) {
        if (!tablero [0][2].text ()) {
            posc.push ('0,2')
        }

        if (!tablero [2][2].text ()) {
            posc.push ('2,2')
        }

    } else if (tablero [0][1].text () == ficha) {
        if (!tablero [2][0].text ()) {
            posc.push ('2,0')
        }
        
        if (!tablero [2][2].text ()) {
            posc.push ('2,2')
        }

    } else if (tablero [1][2].text () == ficha) {
        if (!tablero [0][0].text ()) {
            posc.push ('0,0')
        }
        
        if (!tablero [2][0].text ()) {
            posc.push ('2,0')
        }

    } else if (tablero [2][1].text () == ficha) {
        if (!tablero [0][0].text ()) {
            posc.push ('0,0')
        }
        
        if (!tablero [0][2].text ()) {
            posc.push ('0,2')
        }

    } else if (tablero [2][0].text () == ficha) {
        if (!tablero [0][1].text ()) {
            posc.push ('0,1')
        }
        
        if (!tablero [1][2].text ()) {
            posc.push ('1,2')
        }

    } else if (tablero [0][2].text () == ficha) {
        if (!tablero [1][0].text ()) {
            posc.push ('1,0')
        }
        
        if (!tablero [2][1].text ()) {
            posc.push ('2,1')
        }

    } else if (tablero [2][2].text () == ficha) {
        if (!tablero [1][0].text ()) {
            posc.push ('1,0')
        }

        if (!tablero [0][1].text ()) {
            posc.push ('0,1')
        }

    } else if (tablero [0][0].text () == ficha) {
        if (!tablero [1][2].text ()) {
            posc.push ('1,2')
        }

        if (!tablero [2][1].text ()) {
            posc.push ('2,1')
        }
    }

    //Amenaza 5.
    if (tablero [1][1].text () == ficha) {
        if (tablero [1][0].text () && tablero [1][0].text () != ficha) {
            posc.push ('0,2', '2,2')

        } else if (tablero [0][1].text () && tablero [0][1].text () != ficha) {
            posc.push ('2,0', '2,2')

        } else if (tablero [1][2].text () && tablero [1][2].text () != ficha) {
            posc.push ('0,0', '2,0')

        } else if (tablero [2][1].text () && tablero [2][1].text () != ficha) {
            posc.push ('0,0', '0,2')
        }
    }

    if (posc.length) {
        seleccionarCelda (posc)
        return true
    }
    
    return false
}