
package com.softcommerce.views.uipnlliquidacion;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Liquidacion;
import com.softcommerce.beans.BeanParametro;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CuadroMensaje;
import com.softcommerce.general.controles.ItemObject;
import com.softcommerce.iconos.Gif;

import javax.swing.JPanel;
import java.awt.BorderLayout;
import java.awt.Color;

import javax.swing.BorderFactory;
import javax.swing.JToolBar;
import javax.swing.JButton;
import java.awt.Font;
import javax.swing.ImageIcon;
import javax.swing.JScrollPane;
import javax.swing.border.TitledBorder;
import javax.swing.table.DefaultTableModel;

import org.jdesktop.swingx.JXDatePicker;
import org.jdesktop.swingx.JXTable;
import javax.swing.JLabel;
import javax.swing.JTextField;
import javax.swing.JComboBox;
import java.awt.event.ActionListener;
import java.awt.event.ActionEvent;
import java.awt.event.FocusAdapter;
import java.awt.event.FocusEvent;
import java.awt.event.KeyAdapter;
import java.awt.event.KeyEvent;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.io.File;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import javax.swing.JOptionPane;
import javax.swing.SwingConstants;
import javax.swing.table.DefaultTableCellRenderer;
import org.japura.gui.SplitButton;
import org.jdesktop.swingx.decorator.HighlighterFactory;
import com.softcommerce.reglasnegocio.RnLiquidacion;
import com.softcommerce.reglasnegocio.RnUsuario;
import com.softcommerce.report.reporte_v3;
import java.net.URL;

public class UiPnlLiquidacion extends JPanel  implements InterUiPnlLiquidacion {

    /**
     *
     */
    private static final long serialVersionUID = 1L;
    protected JToolBar toolBar;
    protected JButton btnLiquidar;
    protected JButton btnAnular;
    protected JButton btnCerrar;
    protected JPanel panel;
    protected JScrollPane scrollPane;
    protected JXTable table;

    protected DefaultTableModel modelo;
    protected JPanel pnlBusqueda;
    protected JLabel lblVendedor;
    protected JLabel lblFecha;
    protected JLabel lblHasta;
    protected JXDatePicker dtpDesde;
    protected JXDatePicker dtpHasta;
    protected JButton btnBuscar;
    protected JComboBox cboVendedor;
    protected JLabel lblLiquidacion;
    protected JTextField txtSerie;
    protected JTextField txtNumero;
    protected SplitButton btnInforme;

    protected CuadroMensaje cuadro;
    protected URL path;
    protected Usuario usuario;
    protected final Main frm;

    public UiPnlLiquidacion(URL path, Usuario user, Main frm) {
        super();
        this.path = path;
        usuario = user;
        cuadro = new CuadroMensaje(usuario);
        this.frm = frm;
        this.inicialice();
    }

    protected void inicialice() {
        setLayout(new BorderLayout(0, 0));
        add(getToolBar(), BorderLayout.NORTH);
        add(getPanel(), BorderLayout.CENTER);
        ListaUsuarioTrabajador(usuario.getCodempresa(), usuario.getId_trabajador());
    }

    protected JToolBar getToolBar() {
        if (toolBar == null) {
            toolBar = new JToolBar();
            toolBar.setFloatable(false);
            toolBar.add(getBtnLiquidar());
            //toolBar.add(getBtnVer());
            toolBar.add(getBtnAnular());
            toolBar.add(getBtnInformes());
        }
        return toolBar;
    }

    protected JButton getBtnLiquidar() {
        if (btnLiquidar == null) {
            btnLiquidar = new JButton("liquidar");
            btnLiquidar.addActionListener(new ActionListener() {
                @Override
                public void actionPerformed(ActionEvent arg0) {
                    PnlLiquidacionRegistro pnl = new PnlLiquidacionRegistro(path, usuario, frm);
                    pnl.setLocationRelativeTo(null);
                    pnl.setVisible(true);
                }
            });
            btnLiquidar.addKeyListener(new KeyAdapter() {
                @Override
                public void keyPressed(KeyEvent e) {
                    if (e.getKeyCode() == KeyEvent.VK_ENTER) {
                        btnLiquidar.transferFocus();
                    }
                }
            });
            Gif gif=new Gif();
            btnLiquidar.setIcon(gif.liquidar);
            btnLiquidar.setFont(new Font("Tahoma", Font.PLAIN, 11));
        }
        return btnLiquidar;
    }

    protected JButton getBtnAnular() {
        return null;
    }

    public JButton getBtnCerrar() {
        if (btnCerrar == null) {
            btnCerrar = new JButton("Cerrar");
            btnCerrar.setIcon(new ImageIcon(UiPnlLiquidacion.class.getResource("/com/softcommerce/iconos/cerrar.png")));
            btnCerrar.setFont(new Font("Tahoma", Font.PLAIN, 11));
        }
        return btnCerrar;
    }

    protected JPanel getPanel() {
        if (panel == null) {
            panel = new JPanel();
            panel.setLayout(null);
            panel.add(getScrollPane());
            panel.add(getPnlBusqueda());
        }
        return panel;
    }

    protected JScrollPane getScrollPane() {
        if (scrollPane == null) {
            scrollPane = new JScrollPane();
            scrollPane.setBounds(10, 96, 728, 303);
            scrollPane.setViewportView(getTable());
        }
        return scrollPane;
    }

    protected JXTable getTable() {
        return null;
    }

    protected void InicializaTabla() {
        String[] columnas = {"id_regconta", "id_tipo_doc", "Fecha", "Serie", "PreImpreso", "T. Cambio", "Voucher", "id_Auxiliar", "Monto", "id_trabajador", "Trabajador"};
        modelo = new DefaultTableModel(null, columnas);
        getTable().setModel(modelo);
        getTable().getColumn(0).setMinWidth(0);
        getTable().getColumn(0).setMaxWidth(0);
        getTable().getColumn(1).setMinWidth(0);
        getTable().getColumn(1).setMaxWidth(0);
        getTable().getColumn(2).setMinWidth(80);
        getTable().getColumn(2).setMaxWidth(80);
        getTable().getColumn(3).setMinWidth(60);
        getTable().getColumn(3).setMaxWidth(60);
        getTable().getColumn(4).setMinWidth(80);
        getTable().getColumn(4).setMaxWidth(80);
        getTable().getColumn(5).setMinWidth(70);
        getTable().getColumn(5).setMaxWidth(70);
        getTable().getColumn(6).setMinWidth(100);
        getTable().getColumn(6).setMaxWidth(100);
        getTable().getColumn(7).setMinWidth(0);
        getTable().getColumn(7).setMaxWidth(0);
        getTable().getColumn(8).setMinWidth(120);
        getTable().getColumn(8).setMaxWidth(120);
        getTable().getColumn(9).setMinWidth(0);
        getTable().getColumn(9).setMaxWidth(0);
        getTable().getColumn(10).setMinWidth(200);
        getTable().getColumn(10).setMaxWidth(200);

        //NumberRenderer nr = new NumberRenderer(new DecimalFormat("#,##0.00"));
        //getTable().getColumn(5).setCellRenderer(nr);
        DefaultTableCellRenderer tcr = new DefaultTableCellRenderer();
        tcr.setHorizontalAlignment(SwingConstants.RIGHT);
        getTable().getColumn(5).setCellRenderer(tcr);
        getTable().getColumn(8).setCellRenderer(tcr);
    }

    protected JPanel getPnlBusqueda() {
        if (pnlBusqueda == null) {
            pnlBusqueda = new JPanel();
            pnlBusqueda.setBounds(10, 11, 703, 83);
            pnlBusqueda.setBorder(BorderFactory.createTitledBorder(null, "Buscar por:", TitledBorder.DEFAULT_JUSTIFICATION, TitledBorder.DEFAULT_POSITION, new Font("Tahoma", Font.PLAIN, 11), new Color(51, 51, 51)));
            pnlBusqueda.setLayout(null);
            pnlBusqueda.add(getLblVendedor());
            pnlBusqueda.add(getLblFecha());
            pnlBusqueda.add(getLblHasta());
            pnlBusqueda.add(getDtpDesde());
            pnlBusqueda.add(getDtpHasta());
            pnlBusqueda.add(getBtnBuscar());
            pnlBusqueda.add(getCboVendedor());
            pnlBusqueda.add(getLblLiquidacion());
            pnlBusqueda.add(getTxtSerie());
            pnlBusqueda.add(getTxtNumero());
        }
        return pnlBusqueda;
    }

    protected JLabel getLblVendedor() {
        if (lblVendedor == null) {
            lblVendedor = new JLabel("Vendedor:");
            lblVendedor.setFont(new Font("Tahoma", Font.PLAIN, 11));
            lblVendedor.setBounds(10, 26, 60, 22);
        }
        return lblVendedor;
    }

    protected JLabel getLblFecha() {
        if (lblFecha == null) {
            lblFecha = new JLabel("Desde:");
            lblFecha.setFont(new Font("Tahoma", Font.PLAIN, 11));
            lblFecha.setBounds(10, 52, 60, 22);
        }
        return lblFecha;
    }

    protected JLabel getLblHasta() {
        if (lblHasta == null) {
            lblHasta = new JLabel("Hasta:");
            lblHasta.setFont(new Font("Tahoma", Font.PLAIN, 11));
            lblHasta.setBounds(204, 52, 45, 22);
        }
        return lblHasta;
    }

    protected JXDatePicker getDtpDesde() {
        if (dtpDesde == null) {
            dtpDesde = new JXDatePicker();
            dtpDesde.setBounds(74, 52, 120, 22);
            dtpDesde.setFormats("dd/MM/yyyy");
            dtpDesde.setDate(new Date());
            dtpDesde.getEditor().addKeyListener(new KeyAdapter() {
                public void keyPressed(KeyEvent e) {
                    if (e.getKeyCode() == KeyEvent.VK_ENTER) {
                        dtpDesde.getEditor().transferFocus();
                    }
                }
            });
        }
        return dtpDesde;
    }

    protected JXDatePicker getDtpHasta() {
        if (dtpHasta == null) {
            dtpHasta = new JXDatePicker();
            dtpHasta.setBounds(253, 52, 120, 22);
            dtpHasta.setFormats("dd/MM/yyyy");
            dtpHasta.setDate(new Date());
            dtpHasta.getEditor().addKeyListener(new KeyAdapter() {
                public void keyPressed(KeyEvent e) {
                    if (e.getKeyCode() == KeyEvent.VK_ENTER) {
                        dtpHasta.getEditor().transferFocus();
                    }
                }
            });
        }
        return dtpHasta;
    }

    protected JButton getBtnBuscar() {
        if (btnBuscar == null) {
            btnBuscar = new JButton("Buscar");
            btnBuscar.setFont(new Font("Tahoma", Font.PLAIN, 11));
            Gif gif=new Gif();
            btnBuscar.setIcon(gif.BUSCAR);
            btnBuscar.setBounds(505, 52, 100, 22);
            btnBuscar.addKeyListener(new KeyAdapter() {
                public void keyPressed(KeyEvent e) {
                    if (e.getKeyCode() == KeyEvent.VK_ENTER) {
                        Buscar();
                    }
                }
            });
            btnBuscar.addActionListener(new ActionListener() {
                public void actionPerformed(ActionEvent arg0) {
                    Buscar();
                }
            });
        }
        return btnBuscar;
    }

    protected JComboBox getCboVendedor() {
        if (cboVendedor == null) {
            cboVendedor = new JComboBox();
            cboVendedor.setBounds(74, 26, 299, 22);
            cboVendedor.setEnabled(false);
        }
        return cboVendedor;
    }

    protected JLabel getLblLiquidacion() {
        if (lblLiquidacion == null) {
            lblLiquidacion = new JLabel("Liquidacion:");
            lblLiquidacion.setFont(new Font("Tahoma", Font.PLAIN, 11));
            lblLiquidacion.setBounds(381, 26, 60, 22);
        }
        return lblLiquidacion;
    }

    protected JTextField getTxtSerie() {
        if (txtSerie == null) {
            txtSerie = new JTextField();
            txtSerie.setHorizontalAlignment(SwingConstants.RIGHT);
            txtSerie.setFont(new Font("Tahoma", Font.PLAIN, 11));
            txtSerie.setBounds(448, 26, 50, 22);
            txtSerie.addKeyListener(new KeyAdapter() {
                public void keyPressed(KeyEvent e) {
                    if (e.getKeyCode() == KeyEvent.VK_ENTER) {
                        txtSerie.transferFocus();
                    }
                }
            });
            txtSerie.addFocusListener(new FocusAdapter() {
                public void focusLost(FocusEvent arg0) {
                    if (txtSerie.getText().trim().length() > 0) {
                        while (txtSerie.getText().trim().length() < 3) {
                            txtSerie.setText("0" + txtSerie.getText());
                        }
                    }
                }
            });
        }
        return txtSerie;
    }

    protected JTextField getTxtNumero() {
        if (txtNumero == null) {
            txtNumero = new JTextField();
            txtNumero.setBounds(505, 26, 100, 22);
            txtNumero.setFont(new Font("Tahoma", Font.PLAIN, 11));
            txtNumero.setColumns(10);
            txtNumero.setHorizontalAlignment(SwingConstants.RIGHT);
            txtNumero.addKeyListener(new KeyAdapter() {
                public void keyPressed(KeyEvent e) {
                    if (e.getKeyCode() == KeyEvent.VK_ENTER) {
                        txtNumero.transferFocus();
                    }
                }
            });
            txtNumero.addFocusListener(new FocusAdapter() {
                public void focusLost(FocusEvent arg0) {
                    if (txtNumero.getText().trim().length() > 0) {
                        while (txtNumero.getText().trim().length() < 10) {
                            txtNumero.setText("0" + txtNumero.getText());
                        }
                    }
                }
            });
        }
        return txtNumero;
    }

    protected SplitButton getBtnInformes() {
        return null;
    }

    protected void Buscar() {
    }

    protected void BuscaLiquidacion(String id_trabajador, String id_punto_venta, String Serie, String Preimpreso, Date f_inicio, Date f_fin) {
    }

    protected void ListaUsuarioTrabajador(String xEmpresa, String xUsuario) {
    }

    public void AnulaLiquidacion(String Codigo) {
    }

    protected void ReporteFormatoInforme() {
    }
}
