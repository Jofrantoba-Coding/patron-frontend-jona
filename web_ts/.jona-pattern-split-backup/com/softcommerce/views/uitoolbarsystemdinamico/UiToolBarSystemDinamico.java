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
    private InterUiHomeSesion frmsys;
    private Gif gif;
    private Usuario usuario;
    JButton[] buttons;
    Vector<Integer> vectorButton;
    public java.net.URL path;
    private List<MenuDinamico> listado;
    private boolean swTam = true;
    private final Logger logger = Logger.getLogger(UiToolBarSystemDinamico.class);

    public UiToolBarSystemDinamico(InterUiHomeSesion frmsys, java.net.URL path, Usuario user) {
        super();
        this.frmsys = frmsys;
        usuario = user;
        this.path = path;
        init();
    }

    private void init() {
        try {
            gif = new Gif();
            putClientProperty(JLayeredPane.LAYER_PROPERTY, 0);
            setTabLayoutPolicy(JTabbedPane.SCROLL_TAB_LAYOUT);
            setOpaque(false);
            setBackground(new Color(245, 245, 245));
            vectorButton = new Vector<Integer>();
            RnUsuario logic_usuario = new RnUsuario(path);
            listado = new ArrayList<MenuDinamico>();
            listado = logic_usuario.cargaMenuUsuario(usuario.getId_usuario(), "T");
            int cantButton = 0;
            for (int i = 0; i < listado.size(); i++) {
                MenuDinamico beanmenu = (MenuDinamico) listado.get(i);
                if (beanmenu.getMenu_item().trim().equals("S")) {
                    cantButton += 1;
                }
            }
            buttons = new JButton[cantButton];
            if (listado.size() > 0) {
                swTam=true;
                setPreferredSize(new Dimension(1200, 90));
            } else {
                swTam=false;
                setPreferredSize(new Dimension(1200, 0));
            }
            for (int i = 0; i < listado.size(); i++) {
                MenuDinamico beanmenu = (MenuDinamico) listado.get(i);
                if (beanmenu.getMenu_item().trim().equals("S")) {
                    armarJButton(beanmenu.getId_menu(), beanmenu.getNombre(), beanmenu.getDescripcion());
                }
            }

            for (int i = 0; i < listado.size(); i++) {
                MenuDinamico beanmenu = (MenuDinamico) listado.get(i);
                if (beanmenu.getMenu_item().trim().equals("N")) {
                    this.addTab(beanmenu.getNombre(), null, cargarButton(beanmenu.getId_menu()), beanmenu.getDescripcion());
                }
            }

        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    private JPanel cargarButton(int id_padre) {
        JPanel pnl = new JPanel();
        pnl.setLayout(new BorderLayout());
        pnl.setBackground(new Color(238, 238, 238));
        JToolBar toolbar = new JToolBar();

        toolbar.setLayout(new FlowLayout(FlowLayout.LEFT, 5, 0));
        toolbar.setFont(new Font("Tahoma", 0, 12));
        toolbar.setBackground(new Color(245, 245, 245));
        toolbar.setFloatable(false);
        int pos = -1;
        for (int i = 0; i < listado.size(); i++) {
            MenuDinamico beanmenu = (MenuDinamico) listado.get(i);
            if (beanmenu.getId_menu_padre() == id_padre) {
                pos = posJButton(beanmenu.getId_menu());
                toolbar.add(buttons[pos]);
                toolbar.addSeparator(new Dimension(15, 50));
            }
        }
        pnl.add(toolbar, BorderLayout.CENTER);
        return pnl;
    }

    private int posJButton(int id_menu) {
        for (int i = 0; i < vectorButton.size(); i++) {
            if (vectorButton.get(i) == id_menu) {
                return i;
            }
        }
        return -1;
    }

    private void armarJButton(int indice, final String nombre, String descripcion) {
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

    private Icon returnIcon(String nombre) {
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

