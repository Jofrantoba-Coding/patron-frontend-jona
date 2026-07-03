package com.softcommerce.views.uitoolbarsystemdinamico;

import com.softcommerce.beans.MenuDinamico;
import com.softcommerce.beans.Usuario;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnUsuario;

import com.softcommerce.views.uihomesesion.InterUiHomeSesion;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.io.IOException;
import java.net.URISyntaxException;
import javax.swing.JButton;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Desktop;
import java.awt.Dimension;
import java.awt.FlowLayout;
import java.awt.Font;
import java.net.URI;
import java.util.ArrayList;
import java.util.List;
import java.util.Vector;
import javax.swing.Icon;
import javax.swing.JLayeredPane;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTabbedPane;
import javax.swing.JToolBar;
import org.apache.log4j.Logger;

public class UiToolBarSystemDinamico extends JTabbedPane implements InterUiToolBarSystemDinamico {

    private static final long serialVersionUID = 1L;
    protected InterUiHomeSesion frmsys;
    protected Gif gif;
    protected Usuario usuario;
    JButton[] buttons;
    Vector<Integer> vectorButton;
    public java.net.URL path;
    protected List<MenuDinamico> listado;
    protected boolean swTam = true;
    protected final Logger logger = Logger.getLogger(UiToolBarSystemDinamico.class);

    public UiToolBarSystemDinamico(InterUiHomeSesion frmsys, java.net.URL path, Usuario user) {
        super();
        this.frmsys = frmsys;
        usuario = user;
        this.path = path;
        init();
    }

    protected void init() {
    }

    protected JPanel cargarButton(int id_padre) {
        return null;
    }

    protected int posJButton(int id_menu) {
        for (int i = 0; i < vectorButton.size(); i++) {
            if (vectorButton.get(i) == id_menu) {
                return i;
            }
        }
        return -1;
    }

    protected void armarJButton(int indice, final String nombre, String descripcion) {
        this.buttons[vectorButton.size()] = new JButton(returnIcon(nombre));
        this.buttons[vectorButton.size()].setOpaque(false);
        this.buttons[vectorButton.size()].setBorderPainted(true);
        this.buttons[vectorButton.size()].setToolTipText(descripcion);
        this.buttons[vectorButton.size()].addActionListener(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                llamarEvento(nombre);
            }
        });
        vectorButton.add(indice);
    }

    @Override
    public void llamarEvento(String nombre) {
        try {
            logger.info("JButton ToolBar: " + nombre);
            if (nombre.trim().equals("t_cliente")) {
                frmsys.showClienteNuevo();
            } else if (nombre.trim().equals("t_ventaDirecta")) {
                //frmsys.showPuntoVentaDirecta();
                frmsys.showVentaDirecta();
            } else if (nombre.trim().equals("t_cotizacion")) {
                frmsys.showCotizacionNuevo();
            } else if (nombre.trim().equals("t_pedido")) {
                frmsys.showPedido();
            } else if (nombre.trim().equals("t_documentoVenta")) {
                frmsys.showBoleta();
            } else if (nombre.trim().equals("t_liquidacion")) {
                frmsys.showLiquidacion();
            } else if (nombre.trim().equals("t_actualizaDoc")) {
                frmsys.showActualizaDocumento();
            } else if (nombre.trim().equals("t_producto")) {
                frmsys.showItem();
            } else if (nombre.trim().equals("t_notaCredito")) {
                frmsys.showNotaCredito();
            } else if (nombre.trim().equals("t_notaDebito")) {
                frmsys.showNotaDebito();
            } else if (nombre.trim().equals("t_sunat")) {
                if (Desktop.isDesktopSupported()) {
                    Desktop.getDesktop().browse(new URI("http://www.sunat.gob.pe/cl-ti-itmrconsruc/jcrS00Alias"));
                }
            } else if (nombre.trim().equals("t_reniec")) {
                if (Desktop.isDesktopSupported()) {
                    Desktop.getDesktop().browse(new URI("https://cel.reniec.gob.pe/valreg/valreg.do?accion=ini"));
                }
            } else if (nombre.trim().equals("t_buscarDoc")) {
                frmsys.showVerDocumentoVentaSalidas();
            } else if (nombre.trim().equals("t_salida")) {
                frmsys.showDespacho();
            } else if (nombre.trim().equals("t_guiaRemision")) {
                frmsys.showGuiaRemision();
            } else if (nombre.trim().equals("t_proveedor")) {
                frmsys.showProveedor();
            } else if (nombre.trim().equals("t_listaPrecio")) {
                frmsys.showPreciosItems();
            } else if (nombre.trim().equals("t_transporte")) {
                frmsys.showTransportista();
            } else if (nombre.trim().equals("t_conductor")) {
                frmsys.showChofer();
            } else if (nombre.trim().equals("t_correlativo")) {
                frmsys.showCorrelativo();
            } else if (nombre.trim().equals("t_usuarioCorrelativo")) {
                frmsys.showUsuarioCorrelativo();
            } else if (nombre.trim().equals("t_usuario")) {
                frmsys.showUsuario();
            } else if (nombre.trim().equals("t_cambiarPeriodo")) {
                frmsys.showCambiarPeriodoTrabajo();
            } else if (nombre.trim().equals("t_cambiarEstablecimiento")) {
                frmsys.showCambiarEmpresa();
            } else if (nombre.trim().equals("t_trabajador")) {
                frmsys.showTrabajador();
            } else if (nombre.trim().equals("t_trabajadorPtoVta")) {
                frmsys.showTrabajadorPuntoVenta();
            }
        } catch (IOException ex) {
        } catch (URISyntaxException ex) {
        }
    }

    protected Icon returnIcon(String nombre) {
        Icon icon = null;
        if (nombre.equals("t_cliente")) {
            icon = gif.CLIENTE;
        } else if (nombre.equals("t_salida")) {
            icon = gif.NOTASALIDA;
        } else if (nombre.equals("t_correlativo")) {
            icon = gif.CORRELATIVO;
        } else if (nombre.equals("t_ventaDirecta")) {
            icon = gif.VENTADIRECTA;
        } else if (nombre.equals("t_cotizacion")) {
            icon = gif.COTIZACION;
        } else if (nombre.equals("t_pedido")) {
            icon = gif.PEDIDO;
        } else if (nombre.equals("t_documentoVenta")) {
            icon = gif.VENTAS;
        } else if (nombre.equals("t_liquidacion")) {
            icon = gif.LIQUIDACION;
        } else if (nombre.equals("t_actualizaDoc")) {
            icon = gif.ACTUALIZA_DOC;
        } else if (nombre.equals("t_producto")) {
            icon = gif.PRODUCTO;
        } else if (nombre.equals("t_notaCredito")) {
            icon = gif.NOTA_CREDITO;
        } else if (nombre.equals("t_notaDebito")) {
            icon = gif.NOTA_DEBITO;
        } else if (nombre.equals("t_sunat")) {
            icon = gif.SUNAT;
        } else if (nombre.equals("t_reniec")) {
            icon = gif.RENIEC;
        } else if (nombre.equals("t_buscarDoc")) {
            icon = gif.NOTACREDITO;
        } else if (nombre.equals("t_guiaRemision")) {
            icon = gif.GUIAREMISION;
        } else if (nombre.equals("t_proveedor")) {
            icon = gif.PROVEEDOR;
        } else if (nombre.equals("t_listaPrecio")) {
            icon = gif.LISTAPRECIOS;
        } else if (nombre.equals("t_transporte")) {
            icon = gif.TRANSPORTISTA;
        } else if (nombre.equals("t_conductor")) {
            icon = gif.CONDUCTOR;
        } else if (nombre.equals("t_usuarioCorrelativo")) {
            icon = gif.USUARIOCORRELATIVO;
        } else if (nombre.equals("t_usuario")) {
            icon = gif.USUARIO;
        } else if (nombre.equals("t_cambiarPeriodo")) {
            icon = gif.CAMBIARPERIODO;
        } else if (nombre.equals("t_cambiarEstablecimiento")) {
            icon = gif.CAMBIAREMPRESA;
        } else if (nombre.equals("t_trabajador")) {
            icon = gif.TRABAJADOR;
        } else if (nombre.equals("t_trabajadorPtoVta")) {
            icon = gif.TRABAJADORPUNTOVENTA;
        }
        return icon;
    }

    public boolean isSwTam() {
        return swTam;
    }
}

