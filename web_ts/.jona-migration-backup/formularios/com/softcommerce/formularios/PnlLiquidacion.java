
package com.softcommerce.formularios;

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

public class PnlLiquidacion extends JPanel {

    /**
     *
     */
    private static final long serialVersionUID = 1L;
    private JToolBar toolBar;
    private JButton btnLiquidar;
    private JButton btnAnular;
    private JButton btnCerrar;
    private JPanel panel;
    private JScrollPane scrollPane;
    private JXTable table;

    private DefaultTableModel modelo;
    private JPanel pnlBusqueda;
    private JLabel lblVendedor;
    private JLabel lblFecha;
    private JLabel lblHasta;
    private JXDatePicker dtpDesde;
    private JXDatePicker dtpHasta;
    private JButton btnBuscar;
    private JComboBox cboVendedor;
    private JLabel lblLiquidacion;
    private JTextField txtSerie;
    private JTextField txtNumero;
    private SplitButton btnInforme;

    private CuadroMensaje cuadro;
    private URL path;
    private Usuario usuario;
    private final Main frm;

    public PnlLiquidacion(URL path, Usuario user, Main frm) {
        super();
        this.path = path;
        usuario = user;
        cuadro = new CuadroMensaje(usuario);
        this.frm = frm;
        this.inicialice();
    }

    private void inicialice() {
        setLayout(new BorderLayout(0, 0));
        add(getToolBar(), BorderLayout.NORTH);
        add(getPanel(), BorderLayout.CENTER);
        ListaUsuarioTrabajador(usuario.getCodempresa(), usuario.getId_trabajador());
    }

    private JToolBar getToolBar() {
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

    private JButton getBtnLiquidar() {
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

    private JButton getBtnAnular() {
        if (btnAnular == null) {
            btnAnular = new JButton("Anular");
            btnAnular.setIcon(new ImageIcon(PnlLiquidacion.class.getResource("/com/softcommerce/iconos/new_anular_16.png")));
            btnAnular.setFont(new Font("Tahoma", Font.PLAIN, 11));
            btnAnular.addKeyListener(new KeyAdapter() {
                public void keyPressed(KeyEvent e) {
                    if (e.getKeyCode() == KeyEvent.VK_ENTER) {
                        btnAnular.transferFocus();
                    }
                }
            });
            btnAnular.addActionListener(new ActionListener() {
                public void actionPerformed(ActionEvent arg0) {
                    if (getTable().getRowCount() > 0) {
                        int fila = -1;
                        fila = getTable().getSelectedRow();
                        if (fila != -1) {
                            AnulaLiquidacion(getTable().getValueAt(fila, 0).toString());
                        }
                    } else {
                        cuadro.CuadroAviso("No se encontraron documentos para anular", JOptionPane.ERROR_MESSAGE);
                    }
                }
            });
        }
        return btnAnular;
    }

    public JButton getBtnCerrar() {
        if (btnCerrar == null) {
            btnCerrar = new JButton("Cerrar");
            btnCerrar.setIcon(new ImageIcon(PnlLiquidacion.class.getResource("/com/softcommerce/iconos/cerrar.png")));
            btnCerrar.setFont(new Font("Tahoma", Font.PLAIN, 11));
        }
        return btnCerrar;
    }

    private JPanel getPanel() {
        if (panel == null) {
            panel = new JPanel();
            panel.setLayout(null);
            panel.add(getScrollPane());
            panel.add(getPnlBusqueda());
        }
        return panel;
    }

    private JScrollPane getScrollPane() {
        if (scrollPane == null) {
            scrollPane = new JScrollPane();
            scrollPane.setBounds(10, 96, 728, 303);
            scrollPane.setViewportView(getTable());
        }
        return scrollPane;
    }

    private JXTable getTable() {
        if (table == null) {
            table = new JXTable() {
                /**
                 *
                 */
                private static final long serialVersionUID = 1L;

                public String getToolTipText(MouseEvent e) {
                    String tip = null;
                    java.awt.Point p = e.getPoint();
                    int rowIndex = rowAtPoint(p);
                    int colIndex = columnAtPoint(p);

                    try {
                        if (colIndex != 0) {
                            tip = getValueAt(rowIndex, colIndex).toString();
                        }
                    } catch (RuntimeException e1) {

                    }
                    return tip;
                }
            };
            table.addMouseListener(new MouseAdapter() {
                @Override
                public void mouseClicked(MouseEvent e) {
                    /*
                                int fila = -1;
                                fila = table.getSelectedRow();
                                if(fila != -1){
                                        //AsignaDatos(fila);
                                }
                     */
                    if (e.getClickCount() == 2) {
                        ReporteFormatoInforme();
                    }
                }
            });
            table.setHorizontalScrollEnabled(true);
            table.setEditable(false);
            table.getTableHeader().setReorderingAllowed(false);
            table.setFont(new Font("Tahoma", Font.PLAIN, 11));
            table.setHighlighters(HighlighterFactory.createAlternateStriping(new Color(240, 248, 255), new Color(255, 255, 240)));
            InicializaTabla();
        }
        return table;
    }

    private void InicializaTabla() {
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

    private JPanel getPnlBusqueda() {
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

    private JLabel getLblVendedor() {
        if (lblVendedor == null) {
            lblVendedor = new JLabel("Vendedor:");
            lblVendedor.setFont(new Font("Tahoma", Font.PLAIN, 11));
            lblVendedor.setBounds(10, 26, 60, 22);
        }
        return lblVendedor;
    }

    private JLabel getLblFecha() {
        if (lblFecha == null) {
            lblFecha = new JLabel("Desde:");
            lblFecha.setFont(new Font("Tahoma", Font.PLAIN, 11));
            lblFecha.setBounds(10, 52, 60, 22);
        }
        return lblFecha;
    }

    private JLabel getLblHasta() {
        if (lblHasta == null) {
            lblHasta = new JLabel("Hasta:");
            lblHasta.setFont(new Font("Tahoma", Font.PLAIN, 11));
            lblHasta.setBounds(204, 52, 45, 22);
        }
        return lblHasta;
    }

    private JXDatePicker getDtpDesde() {
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

    private JXDatePicker getDtpHasta() {
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

    private JButton getBtnBuscar() {
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

    private JComboBox getCboVendedor() {
        if (cboVendedor == null) {
            cboVendedor = new JComboBox();
            cboVendedor.setBounds(74, 26, 299, 22);
            cboVendedor.setEnabled(false);
        }
        return cboVendedor;
    }

    private JLabel getLblLiquidacion() {
        if (lblLiquidacion == null) {
            lblLiquidacion = new JLabel("Liquidacion:");
            lblLiquidacion.setFont(new Font("Tahoma", Font.PLAIN, 11));
            lblLiquidacion.setBounds(381, 26, 60, 22);
        }
        return lblLiquidacion;
    }

    private JTextField getTxtSerie() {
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

    private JTextField getTxtNumero() {
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

    private SplitButton getBtnInformes() {
        if (btnInforme == null) {
            btnInforme = new SplitButton(SplitButton.BUTTON);
            btnInforme.addButton("Ver Liquidación        ");
            btnInforme.addButton("Formato impresión");
            btnInforme.addButton("Formato informe");
            btnInforme.addButton("Doc. sin liquidar");
            btnInforme.addActionListener("Doc. sin liquidar", new ActionListener() {
                public void actionPerformed(ActionEvent e) {
                    ItemObject itT = (ItemObject) getCboVendedor().getSelectedItem();

                    List<BeanParametro> Listap = new ArrayList<BeanParametro>();
                    BeanParametro p = new BeanParametro();
                    p.setNombre("paramTrabajador");
                    p.setValor(itT.getId().trim());
                    Listap.add(p);

                    java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("yyyy");
                    String fecha = sdf.format(new Date());

                    BeanParametro p1 = new BeanParametro();
                    p1.setNombre("paramAnio");
                    p1.setValor(fecha);
                    Listap.add(p1);

                    BeanParametro p2 = new BeanParametro();
                    p2.setNombre("paramEmpresa");
                    p2.setValor(usuario.getDescriempresa());
                    Listap.add(p2);

                    BeanParametro p3 = new BeanParametro();
                    p3.setNombre("paramDireccion");
                    p3.setValor(usuario.getDireccion());
                    Listap.add(p3);

                    File miDir = new File(".");
                    String ruta = miDir.getAbsolutePath().substring(0, miDir.getAbsolutePath().length() - 1);
                    BeanParametro p4 = new BeanParametro();
                    p4.setNombre("paramImagen");
                    p4.setValor(ruta + "src\\com\\softcommerce\\iconos\\LOGO.png");
                    Listap.add(p4);
                    new reporte_v3(path, "rpt_DocSinLiquidar", Listap, true, false, false, false);
                }
            });
            btnInforme.addActionListener("Formato impresión", new ActionListener() {
                public void actionPerformed(ActionEvent e) {
                    /* reporte sin formato */
                    try {
                        if (getTable().getRowCount() > 0) {
                            int fila = getTable().getSelectedRow();

                            if (fila != -1) {
                                if (getTable().getValueAt(fila, 10).toString().equals("LIQUIDACION ANULADA") == false) {
                                    ItemObject itT = (ItemObject) getCboVendedor().getSelectedItem();

                                    List<BeanParametro> Listap = new ArrayList<BeanParametro>();
                                    BeanParametro p = new BeanParametro();
                                    p.setNombre("paramTrabajador");
                                    p.setValor(itT.getId().trim());
                                    Listap.add(p);

                                    BeanParametro p1 = new BeanParametro();
                                    p1.setNombre("paramPuntoVenta");
                                    p1.setValor(usuario.getCodpuntoventa());
                                    Listap.add(p1);

                                    BeanParametro p2 = new BeanParametro();
                                    p2.setNombre("paramFecha");
                                    p2.setValor(getTable().getValueAt(fila, 2).toString());
                                    Listap.add(p2);

                                    BeanParametro p3 = new BeanParametro();
                                    p3.setNombre("paramSerie");
                                    p3.setValor(getTable().getValueAt(fila, 3).toString());
                                    Listap.add(p3);

                                    BeanParametro p4 = new BeanParametro();
                                    p4.setNombre("paramEmpresa");
                                    p4.setValor(usuario.getDescriempresa());
                                    Listap.add(p4);

                                    new reporte_v3(path, "rpt_Liquidacion", Listap, true, false, false, false);
                                } else {
                                    cuadro.CuadroAviso("El documento se encuentra anulado", JOptionPane.WARNING_MESSAGE);
                                }
                            } else {
                                cuadro.CuadroAviso("Debe seleccionar un registro", JOptionPane.WARNING_MESSAGE);
                            }
                        }
                    } catch (Exception ex) {
                        cuadro.CuadroAviso("Error al generar reporte", JOptionPane.ERROR_MESSAGE);
                        ex.printStackTrace();
                    }
                }
            });
            btnInforme.addActionListener("Formato informe", new ActionListener() {
                public void actionPerformed(ActionEvent e) {
                    /* reporte con formato */
                    ReporteFormatoInforme();
                }
            });

        }
        return btnInforme;
    }

    private void Buscar() {
        if (getDtpDesde().getDate().compareTo(getDtpHasta().getDate()) == 1) {
            cuadro.CuadroAviso("La fecha de inicio es mayor a la fecha fin", JOptionPane.WARNING_MESSAGE);
            return;
        }

        ItemObject it = (ItemObject) getCboVendedor().getSelectedItem();

        BuscaLiquidacion(it.getId(), usuario.getCodpuntoventa(), getTxtSerie().getText().trim(), getTxtNumero().getText().trim(), getDtpDesde().getDate(), getDtpHasta().getDate());
    }

    private void BuscaLiquidacion(String id_trabajador, String id_punto_venta, String Serie, String Preimpreso, Date f_inicio, Date f_fin) {
        try {
            RnLiquidacion obj = new RnLiquidacion(path);
            List<Liquidacion> lista = obj.BuscaLiquidacion(id_trabajador, id_punto_venta, Serie, Preimpreso, f_inicio, f_fin);

            InicializaTabla();
            if (lista.isEmpty()) {
                cuadro.CuadroAviso("No se encontraron registros.", JOptionPane.PLAIN_MESSAGE);
            } else {
                java.text.SimpleDateFormat sdf = new java.text.SimpleDateFormat("dd/MM/yyyy");

                for (int i = 0; i < lista.size(); i++) {
                    Object[] data = new Object[11];
                    String fecha = sdf.format(lista.get(i).getFechaEmision());

                    data[0] = lista.get(i).getIdRegconta();
                    data[1] = lista.get(i).getIdTipoDoc();
                    data[2] = fecha;
                    data[3] = lista.get(i).getSerie();
                    data[4] = lista.get(i).getPreimpreso();
                    data[5] = lista.get(i).getTipoCambio();
                    data[6] = lista.get(i).getVoucher();
                    data[7] = lista.get(i).getIdAuxiliar();
                    data[8] = lista.get(i).getMonto();
                    data[9] = lista.get(i).getIdTrabajador();
                    data[10] = lista.get(i).getNombreTrabajador();

                    modelo.addRow(data);
                }
                getTable().setModel(modelo);
            }

        } catch (Exception ex) {
            cuadro.CuadroAviso("Error al realizar busqueda: " + ex.getMessage(), JOptionPane.ERROR_MESSAGE);
        }
    }

    private void ListaUsuarioTrabajador(String xEmpresa, String xUsuario) {
        try {
            RnUsuario obj = new RnUsuario(path);
            List<Usuario> user = obj.ListaUsuarioTrabajador(xEmpresa);

            getCboVendedor().removeAllItems();
            getCboVendedor().addItem(new ItemObject("0", "------- NINGUNO -----"));
            for (int i = 0; i < user.size(); i++) {
                getCboVendedor().addItem(new ItemObject(user.get(i).getId_trabajador(), user.get(i).getTrabajador()));
            }
            for (int i = 0; i < getCboVendedor().getItemCount(); i++) {
                ItemObject it = (ItemObject) getCboVendedor().getItemAt(i);
                if (it.getId().trim().equals(xUsuario.trim()) == true) {
                    getCboVendedor().setSelectedIndex(i);
                }
            }
        } catch (Exception ex) {
            cuadro.CuadroAviso("Error al cargar datos del personal: " + ex.getMessage(), JOptionPane.ERROR_MESSAGE);
        }
    }

    public void AnulaLiquidacion(String Codigo) {
        try {
            RnLiquidacion obj = new RnLiquidacion(path);
            if (obj.PermiteAnularLiquidacion(Codigo) == true) {
                if (obj.AnulaLiquidacion(Codigo) == true) {
                    cuadro.CuadroAviso("Liquidación anulada", JOptionPane.PLAIN_MESSAGE);
                }
                Buscar();
            } else {
                cuadro.CuadroAviso("No puede eliminar esta liquidación", JOptionPane.ERROR_MESSAGE);
            }

        } catch (Exception ex) {
            cuadro.CuadroAviso("Error al anular la liquidación", JOptionPane.ERROR_MESSAGE);
            ex.printStackTrace();
        }
    }

    private void ReporteFormatoInforme() {
        if (getTable().getRowCount() > 0) {
            int fila = getTable().getSelectedRow();

            if (fila != -1) {
                if (getTable().getValueAt(fila, 10).toString().equals("LIQUIDACION ANULADA") == false) {
                    ItemObject itT = (ItemObject) getCboVendedor().getSelectedItem();

                    List<BeanParametro> Listap = new ArrayList<BeanParametro>();
                    BeanParametro p = new BeanParametro();
                    p.setNombre("paramTrabajador");
                    p.setValor(itT.getId().trim());
                    Listap.add(p);

                    BeanParametro p1 = new BeanParametro();
                    p1.setNombre("paramPuntoVenta");
                    p1.setValor(usuario.getCodpuntoventa());
                    Listap.add(p1);

                    BeanParametro p2 = new BeanParametro();
                    p2.setNombre("paramFecha");
                    p2.setValor(getTable().getValueAt(fila, 2).toString());
                    Listap.add(p2);

                    BeanParametro p3 = new BeanParametro();
                    p3.setNombre("paramEmpresa");
                    p3.setValor(usuario.getDescriempresa());
                    Listap.add(p3);

                    BeanParametro p4 = new BeanParametro();
                    p4.setNombre("paramDireccion");
                    p4.setValor(usuario.getDireccion());
                    Listap.add(p4);

                    File miDir = new File(".");
                    String ruta = miDir.getAbsolutePath().substring(0, miDir.getAbsolutePath().length() - 1);
                    BeanParametro p5 = new BeanParametro();
                    p5.setNombre("paramImagen");
                    p5.setValor(ruta + "src\\com\\softcommerce\\iconos\\iconsoftcommerce.png");
                    Listap.add(p5);

                    BeanParametro p6 = new BeanParametro();
                    p6.setNombre("paramSerie");
                    p6.setValor(getTable().getValueAt(fila, 3).toString());
                    Listap.add(p6);
                    new reporte_v3(path, "rpt_LiquidacionFI", Listap, true, false, false, false);
                } else {
                    cuadro.CuadroAviso("El documento se encuentra anulado", JOptionPane.WARNING_MESSAGE);
                }
            } else {
                cuadro.CuadroAviso("Debe seleccionar un registro", JOptionPane.WARNING_MESSAGE);
            }
        }
    }
}
