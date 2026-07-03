/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uipaneldiferenciaprecio;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Anexo;
import com.softcommerce.beans.ContaCab;
import com.softcommerce.beans.ContaItem;
import com.softcommerce.beans.Usuario;
import com.toedter.calendar.JDateChooser;
import com.toedter.calendar.JTextFieldDateEditor;
import com.softcommerce.general.controles.CDialog;
import com.softcommerce.general.controles.JHInternal;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.iconos.Gif;
import java.awt.Color;
import java.awt.Component;
import java.awt.Font;
import java.awt.Frame;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.event.WindowEvent;
import java.awt.event.WindowListener;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JScrollPane;
import javax.swing.JTextField;
import javax.swing.SwingConstants;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.herramientas.DateTime;
import com.softcommerce.general.tablas.PnlDiferenciaPrecioTableModel;
import java.awt.event.FocusListener;
import java.util.Date;
import java.util.List;
import javax.swing.JComponent;
import javax.swing.KeyStroke;
import com.softcommerce.reglasnegocio.RnAnexo;
import com.softcommerce.reglasnegocio.RnRegContaCab;
import com.softcommerce.util.CompareDate;
import com.softcommerce.util.FormatObject;
import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import javax.swing.JCheckBox;
import javax.swing.JOptionPane;
import javax.swing.event.TableModelEvent;
import javax.swing.event.TableModelListener;

public class UiPanelDiferenciaPrecio
        extends CDialog implements InterUiPanelDiferenciaPrecio, ActionListener, KeyListener, WindowListener, FocusListener {

    protected PnlDiferenciaPrecioTableModel mdl_documento;
    protected CTable tbl_documento;
    protected JScrollPane scp_documento;
    protected JButton btn_agregar;
    protected JButton btn_cancelar;
    protected JButton btn_buscar;
    protected JButton btn_nuevo;
    protected JComboBox cbo_idtipodoc;
    protected JComboBox cbo_idestado;
    protected JDateChooser dc_fechainicio;
    protected JDateChooser dc_fechafin;
    protected JTextField txt_tmpruc;
    protected JTextField txt_serie;
    protected JTextField txt_preimpreso;
    protected JTextField txt_tmpanexo;
    protected JTextField txt_idanexo;
    protected JTextField txt_idregconta;
    protected JHInternal arg;
    protected Frame frame;
    protected Component comp;
    protected Usuario usuario;
    protected java.net.URL path;
    protected JCheckBox chk_seleccionar;
    protected JTextField txt_afecto;
    protected JTextField txt_noafecto;
    protected JTextField txt_igv;
    protected JTextField txt_percepcion;
    protected JTextField txt_total;
    protected JTextField txt_monto;
    protected JTextField txt_descuento;

    public UiPanelDiferenciaPrecio(Frame arg0, JHInternal arg, Usuario usuario, java.net.URL path) {
        super(arg0);
        this.frame = arg0;
        this.path = path;
        this.arg = arg;
        this.usuario = usuario;
        initialize();
    }

    protected void initialize() {
        addWindowListener(this);

        Gif gif = new Gif();

        JPanel pnl = new JPanel();
        pnl.setBackground(new Color(243, 248, 252));
        pnl.setOpaque(false);
        pnl.setLayout(null);

        mdl_documento = new PnlDiferenciaPrecioTableModel();
        tbl_documento = new CTable();
        tbl_documento.setModel(mdl_documento);
        tbl_documento.setAllTableNoEditable();
        tbl_documento.setColumnEditable(0);
        tbl_documento.setColumnEditable(7);
        tbl_documento.setNoVisibleColumn(24);
        tbl_documento.setAllColumnPreferredWidth();
        tbl_documento.getColumnModel().getColumn(0).setPreferredWidth(10);
        tbl_documento.getColumnModel().getColumn(1).setPreferredWidth(40);
        tbl_documento.addKeyListener(this);
        tbl_documento.getModel().addTableModelListener(new TableModelListener() {
            @Override
            public void tableChanged(TableModelEvent evento) {
                if (evento.getType() == TableModelEvent.UPDATE) {
                    ind = tbl_documento.getSelectedRow();
                    calcularImportesDescuento();
                }

            }
        });

        tbl_documento.addKeyListener(new KeyListener() {
            @Override
            public void keyTyped(KeyEvent e) {
            }

            @Override
            public void keyPressed(KeyEvent e) {
                if (e.getKeyCode() == KeyEvent.VK_ENTER) {
                }
            }

            @Override
            public void keyReleased(KeyEvent e) {
                if (e.getKeyCode() == KeyEvent.VK_ENTER) {
                    calcularImportesDescuento();
                }
            }
        });
        tbl_documento.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_ANCESTOR_OF_FOCUSED_COMPONENT);

        scp_documento = new JScrollPane(tbl_documento, JScrollPane.VERTICAL_SCROLLBAR_ALWAYS, JScrollPane.HORIZONTAL_SCROLLBAR_ALWAYS);
        scp_documento.setBounds(5, 30, 855, 245);
        pnl.add(scp_documento);
        CLabel lblMAfecto = new CLabel("Afecto");
        lblMAfecto.setBounds(5, 285, 40, 20);
        lblMAfecto.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnl.add(lblMAfecto);

        txt_descuento = new JTextField();
        txt_descuento.setText("0.0");
        txt_afecto = new JTextField();
        txt_afecto.setBounds(45, 285, 80, 20);
        txt_afecto.setHorizontalAlignment(SwingConstants.RIGHT);
        txt_afecto.setFont(new Font(Font.SANS_SERIF, 1, 13));
        txt_afecto.addKeyListener(this);
        txt_afecto.setEditable(false);
        pnl.add(txt_afecto);

        CLabel lblMNoAfecto = new CLabel("No Afecto");
        lblMNoAfecto.setBounds(150, 285, 60, 20);
        lblMNoAfecto.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnl.add(lblMNoAfecto);

        txt_noafecto = new JTextField();
        txt_noafecto.setBounds(200, 285, 80, 20);
        txt_noafecto.setHorizontalAlignment(SwingConstants.RIGHT);
        txt_noafecto.setFont(new Font(Font.SANS_SERIF, 1, 13));
        txt_noafecto.addKeyListener(this);
        txt_noafecto.setEditable(false);
        pnl.add(txt_noafecto);

        CLabel lblMIgv = new CLabel("Igv");
        lblMIgv.setBounds(300, 285, 20, 20);
        lblMIgv.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnl.add(lblMIgv);

        txt_igv = new JTextField();
        txt_igv.setBounds(320, 285, 80, 20);
        txt_igv.setHorizontalAlignment(SwingConstants.RIGHT);
        txt_igv.setFont(new Font(Font.SANS_SERIF, 1, 13));
        txt_igv.addKeyListener(this);
        txt_igv.setEditable(false);
        pnl.add(txt_igv);

        CLabel lblMonto = new CLabel("Monto");
        lblMonto.setBounds(440, 285, 40, 20);
        lblMonto.setFont(new Font(Font.SANS_SERIF, 0, 11));
        lblMonto.setVisible(false);
        pnl.add(lblMonto);

        txt_monto = new JTextField();
        txt_monto.setBounds(480, 285, 100, 25);
        txt_monto.addKeyListener(this);
        txt_monto.setFont(new Font(Font.SANS_SERIF, 1, 18));
        txt_monto.setEditable(false);
        txt_monto.setHorizontalAlignment(SwingConstants.RIGHT);
        txt_monto.setForeground(Color.RED);
        txt_monto.setVisible(false);
        pnl.add(txt_monto);

        JLabel lblMPercepcion = new JLabel("Perc");
        lblMPercepcion.setFont(new Font(Font.SANS_SERIF, 0, 11));
        lblMPercepcion.setForeground(Color.BLACK);
        lblMPercepcion.setBounds(600, 285, 25, 20);
        pnl.add(lblMPercepcion);

        txt_percepcion = new JTextField();
        txt_percepcion.setBounds(625, 285, 90, 25);
        txt_percepcion.setHorizontalAlignment(SwingConstants.RIGHT);
        txt_percepcion.addKeyListener(this);
        txt_percepcion.setForeground(Color.BLUE);
        txt_percepcion.setFont(new Font(Font.SANS_SERIF, 1, 18));
        txt_percepcion.setEditable(false);
        pnl.add(txt_percepcion);

        JLabel lblTotal = new JLabel("Total");
        lblTotal.setFont(new Font(Font.SANS_SERIF, 0, 11));
        lblTotal.setForeground(Color.BLACK);
        lblTotal.setBounds(735, 285, 30, 20);
        pnl.add(lblTotal);

        txt_total = new JTextField();
        txt_total.setBounds(765, 285, 100, 25);
        txt_total.setHorizontalAlignment(SwingConstants.RIGHT);
        txt_total.addKeyListener(this);
        txt_total.setForeground(Color.darkGray);
        txt_total.setFont(new Font(Font.SANS_SERIF, 1, 18));
        txt_total.setEditable(false);
        pnl.add(txt_total);

        chk_seleccionar = new JCheckBox("Seleccionar Todo");
        chk_seleccionar.setBounds(5, 8, 150, 20);
        chk_seleccionar.setFont(new Font("Verdana", 1, 11));
        chk_seleccionar.addKeyListener(this);
        chk_seleccionar.setHorizontalTextPosition(SwingConstants.LEFT);
        chk_seleccionar.addFocusListener(this);
        chk_seleccionar.setOpaque(false);
        tbl_documento.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                if (e.getClickCount() == 1) {
                    calcularImportesDescuento();
                }
            }
        });

        JLabel lblCodigoDespacho = new JLabel("Código");
        lblCodigoDespacho.setBounds(5, 5, 40, 20);
        lblCodigoDespacho.setFont(new Font("Verdana", 0, 11));
        lblCodigoDespacho.setVisible(false);
        pnl.add(lblCodigoDespacho);

        txt_idregconta = new JTextField();
        txt_idregconta.setBounds(55, 5, 90, 20);
        txt_idregconta.addKeyListener(this);
        txt_idregconta.setDocument(new IntegerDocument(10));
        txt_idregconta.addFocusListener(this);
        txt_idregconta.setVisible(false);
        txt_idregconta.setFont(new Font(Font.SANS_SERIF, 0, 11));
        pnl.add(txt_idregconta);

        JLabel lblSerie = new JLabel("N° Doc");
        lblSerie.setBounds(160, 5, 40, 20);
        lblSerie.setVisible(false);
        pnl.add(lblSerie);

        cbo_idtipodoc = new JComboBox();
        cbo_idtipodoc.setBounds(200, 5, 40, 20);
        cbo_idtipodoc.addItem("T");
        cbo_idtipodoc.addItem("F");
        cbo_idtipodoc.addItem("B");
        cbo_idtipodoc.addActionListener(this);
        cbo_idtipodoc.setVisible(false);
        cbo_idtipodoc.addKeyListener(this);
        pnl.add(cbo_idtipodoc);

        txt_serie = new JTextField();
        txt_serie.setBounds(245, 5, 30, 20);
        txt_serie.addKeyListener(this);
        txt_serie.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txt_serie.addFocusListener(this);
        FormatObject.formatJTextFieldSerie(txt_serie);
        txt_serie.setForeground(Color.BLACK);
        txt_serie.setVisible(false);
        pnl.add(txt_serie);

        txt_preimpreso = new JTextField();
        txt_preimpreso.setBounds(280, 5, 80, 20);
        txt_preimpreso.addKeyListener(this);
        txt_preimpreso.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txt_preimpreso.addFocusListener(this);
        txt_preimpreso.setDocument(new IntegerDocument(10));
        txt_preimpreso.setForeground(Color.BLACK);
        txt_preimpreso.setVisible(false);
        pnl.add(txt_preimpreso);

        JLabel lblRazonSocial = new JLabel("R Social");
        lblRazonSocial.setBounds(395, 5, 45, 20);
        lblRazonSocial.setVisible(false);
        pnl.add(lblRazonSocial);

        txt_idanexo = new JTextField();
        txt_idanexo.setBounds(440, 5, 80, 20);
        txt_idanexo.addKeyListener(this);
        txt_idanexo.addFocusListener(this);
        txt_idanexo.setVisible(false);
        pnl.add(txt_idanexo);

        txt_tmpanexo = new JTextField();
        txt_tmpanexo.setBounds(523, 5, 315, 20);
        txt_tmpanexo.addKeyListener(this);
        txt_tmpanexo.setDocument(new UpperCaseNumberDocument(255));
        txt_tmpanexo.addFocusListener(this);
        pnl.add(txt_tmpanexo);

        JLabel lbl_RucCliente = new JLabel("RUC/DNI");
        lbl_RucCliente.setBounds(5, 35, 50, 20);
        lbl_RucCliente.setVisible(false);
        pnl.add(lbl_RucCliente);

        txt_tmpruc = new JTextField();
        txt_tmpruc.setBounds(55, 35, 80, 20);
        txt_tmpanexo.setVisible(false);
        txt_tmpruc.setVisible(false);
        txt_tmpruc.setFont(new Font(Font.SANS_SERIF, 0, 11));
        txt_tmpruc.addFocusListener(this);
        txt_tmpruc.setDocument(new IntegerDocument(11));
        txt_tmpruc.addKeyListener(this);
        pnl.add(txt_tmpruc);

        cbo_idestado = new JComboBox();
        cbo_idestado.setBounds(541, 35, 50, 20);
        cbo_idestado.addItem("T");
        cbo_idestado.addItem("ATE");
        cbo_idestado.addItem("PAA");
        cbo_idestado.addItem("PEN");
        cbo_idestado.setVisible(false);
        cbo_idestado.addActionListener(this);
        cbo_idestado.addKeyListener(this);
        pnl.add(cbo_idestado);

        dc_fechainicio = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        ((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).addFocusListener(this);
        dc_fechainicio.setBounds(210, 35, 90, 20);
        dc_fechainicio.getJCalendar().addFocusListener(this);
        dc_fechainicio.getJCalendar().addKeyListener(this);
        dc_fechainicio.getCalendarButton().addActionListener(this);
        dc_fechainicio.addKeyListener(this);
        dc_fechainicio.addFocusListener(this);
        dc_fechainicio.setVisible(false);
        ((JTextField) dc_fechainicio.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                ((JTextFieldDateEditor) dc_fechafin.getDateEditor()).requestFocus();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        ((JTextField) dc_fechainicio.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dc_fechainicio.getCalendarButton().doClick();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_SPACE, 0, false), JComponent.WHEN_FOCUSED);
        pnl.add(dc_fechainicio);

        JLabel lblFechaInicio = new JLabel("Fec Inicio");
        lblFechaInicio.setVisible(false);
        lblFechaInicio.setDisplayedMnemonic('c');
        lblFechaInicio.setLabelFor(dc_fechainicio);
        lblFechaInicio.setBounds(160, 35, 50, 20);
        pnl.add(lblFechaInicio);

        dc_fechafin = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        ((JTextFieldDateEditor) dc_fechafin.getDateEditor()).addFocusListener(this);
        dc_fechafin.setBounds(370, 35, 90, 20);
        dc_fechafin.getJCalendar().addFocusListener(this);
        dc_fechafin.getJCalendar().addKeyListener(this);
        dc_fechafin.getCalendarButton().addActionListener(this);
        dc_fechafin.setVisible(false);

        dc_fechafin.addKeyListener(this);
        dc_fechafin.addFocusListener(this);
        ((JTextField) dc_fechafin.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                cbo_idestado.requestFocus();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        ((JTextField) dc_fechafin.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dc_fechafin.getCalendarButton().doClick();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_SPACE, 0, false), JComponent.WHEN_FOCUSED);
        pnl.add(dc_fechafin);

        JLabel lblFechaFin = new JLabel("Fec Fin");
        lblFechaFin.setBounds(330, 35, 40, 20);
        lblFechaFin.setDisplayedMnemonic('a');
        lblFechaFin.setLabelFor(dc_fechafin);
        lblFechaFin.setVisible(false);
        pnl.add(lblFechaFin);

        JLabel lbl_familia = new JLabel("Estado");
        lbl_familia.setFont(new Font("Verdana", 0, 11));
        lbl_familia.setBounds(492, 35, 50, 20);
        lbl_familia.setVisible(false);
        pnl.add(lbl_familia);

        btn_cancelar = new JButton("Cancelar", gif.CANCEL16);
        btn_cancelar.setMnemonic('C');
        btn_cancelar.setHorizontalAlignment(SwingConstants.LEFT);
        btn_cancelar.setIconTextGap(10);
        btn_cancelar.addActionListener(this);
        btn_cancelar.setFont(new Font("Verdana", 1, 10));
        btn_cancelar.setOpaque(false);
        btn_cancelar.addKeyListener(this);
        btn_cancelar.setFocusPainted(false);
        btn_cancelar.setBounds(5, 325, 120, 25);
        pnl.add(btn_cancelar);

        btn_agregar = new JButton("Agregar", gif.ADD16);
        btn_agregar.setMnemonic('B');
        btn_agregar.setHorizontalAlignment(SwingConstants.LEFT);
        btn_agregar.setIconTextGap(10);
        btn_agregar.addActionListener(this);
        btn_agregar.setFont(new Font("Verdana", 1, 10));
        btn_agregar.setOpaque(false);
        btn_agregar.addKeyListener(this);
        btn_agregar.setFocusPainted(false);
        btn_agregar.setBounds(740, 325, 120, 25);
        pnl.add(btn_agregar);
        btn_nuevo = new JButton(gif.NEW16);
        btn_nuevo.setBounds(610, 35, 40, 20);
        btn_nuevo.setHorizontalTextPosition(SwingConstants.LEFT);
        btn_nuevo.setToolTipText("Filtrar");
        btn_nuevo.setContentAreaFilled(true);
        btn_nuevo.setBorderPainted(true);
        btn_nuevo.setFocusable(true);
        btn_nuevo.setFocusPainted(false);
        btn_nuevo.setVisible(false);
        btn_nuevo.addActionListener(this);
        btn_nuevo.addKeyListener(this);
        btn_nuevo.registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        pnl.add(this.btn_nuevo);
        setBackground(new Color(245, 245, 245));
        setTitle("Buscar Documentos de Venta");
        setContentPane(pnl);
        setModal(true);
        setResizable(false);
        setSize(890, 420);
        ComponentToolKit.centerComponentPosicion(this);
    }
    int ind = 0;

    public void calcularImportesDescuento() {
    }

    public void limpiar() {
    }

    public void cargarTabla(Component ls_comp) {
    }

    public void cargarTabla() {
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() == txt_idregconta) {
            txt_idregconta.selectAll();
        }

        if (e.getSource() == ((JTextFieldDateEditor) dc_fechainicio.getDateEditor())) {
            ((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).selectAll();
        }

        if (e.getSource() == ((JTextFieldDateEditor) dc_fechafin.getDateEditor())) {
            ((JTextFieldDateEditor) dc_fechafin.getDateEditor()).selectAll();
        }

        if (e.getSource() == txt_tmpanexo) {
            txt_tmpanexo.selectAll();
        }

        if (e.getSource() == txt_idanexo) {
            txt_idanexo.selectAll();
        }

        if (e.getSource() == txt_tmpruc) {
            txt_tmpruc.selectAll();
        }

        if (e.getSource() == txt_serie) {
            txt_serie.selectAll();
        }

        if (e.getSource() == txt_preimpreso) {
            txt_preimpreso.selectAll();
        }
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource().equals(txt_serie)) {
            FormatObject.formatSerie((JTextField) e.getSource());
        }
        if (e.getSource() == txt_idregconta && txt_idregconta.getText().trim().length() > 0) {
            String serie = "0000000000" + txt_idregconta.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 10, serie.length());

            txt_idregconta.setText(nuevaserie);
        }

        if (e.getSource() == txt_idanexo && txt_idanexo.getText().trim().length() > 0) {
            String serie = "0000000000" + txt_idanexo.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 10, serie.length());

            txt_idanexo.setText(nuevaserie);
        }

        if (e.getSource() == txt_preimpreso && txt_preimpreso.getText().trim().length() > 0) {
            String serie = "0000000000" + txt_preimpreso.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 10, serie.length());

            txt_preimpreso.setText(nuevaserie);
        }
    }

    @Override
    public void windowOpened(WindowEvent e) {
        txt_preimpreso.requestFocus();
    }

    @Override
    public void windowClosing(WindowEvent e) {
        dispose();
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == btn_buscar) {
            cargarTabla();
        }

        if (e.getSource() == dc_fechainicio.getCalendarButton()) {
            dc_fechainicio.setSelectableDateRange(new Date(100, 0, 1), dc_fechafin.getDate());
        }

        if (e.getSource() == dc_fechafin.getCalendarButton()) {
            dc_fechafin.setSelectableDateRange(dc_fechainicio.getDate(), dc_fechafin.getMaxSelectableDate());
        }

        if (btn_cancelar == e.getSource()) {
            dispose();
        }

        if (e.getSource() == btn_nuevo) {
            limpiar();
        }

        if (e.getSource() == btn_agregar) {
            obtenerDatos();
        }
    }

    public boolean cargarCliente(String id_cliente) {
        return false;
    }

    protected void cargarDocumentoReferenciaDocumentoCambioPrecio(ContaCab r) {
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            dispose();
        }

        if (e.getKeyCode() == KeyEvent.VK_F5) {
            cargarTabla();
        }

        if (e.getKeyChar() == '\n') {
            if (txt_tmpanexo == e.getSource()) {
                if (txt_tmpanexo.getText().trim().length() == 0) {
                    txt_tmpruc.requestFocus();
                } else {
                    BuscarCliente buscar_cliente = new BuscarCliente(this, path);
                    Anexo a = new Anexo();
                    a.setIdTipoAnexo("2");
                    a.setIdEmpresa(usuario.getCodempresa());
                    a.setDescripcion(txt_tmpanexo.getText().trim());
                    buscar_cliente.cargarTabla(a, null, 0);
                }
            }

            if (txt_idregconta == e.getSource()) {
                cbo_idtipodoc.requestFocus();
            }

            if (cbo_idtipodoc == e.getSource()) {
                txt_serie.requestFocus();
            }

            if (txt_serie == e.getSource()) {
                txt_preimpreso.requestFocus();
            }

            if (txt_preimpreso == e.getSource()) {
                txt_tmpanexo.requestFocus();
            }

            if (txt_tmpruc == e.getSource()) {
                ((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).requestFocus();
            }

            if (cbo_idestado == e.getSource()) {
                if (tbl_documento.getRowCount() > 0) {
                    tbl_documento.setRowSelectionInterval(0, 0);
                    tbl_documento.requestFocus();
                } else {
                    btn_cancelar.requestFocus();
                }
            }
        }
    }

    public void obtenerDatos() {
    }

    @Override
    public void keyReleased(KeyEvent e) {
    }

    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void windowClosed(WindowEvent e) {
    }

    @Override
    public void windowIconified(WindowEvent e) {
    }

    @Override
    public void windowDeiconified(WindowEvent e) {
    }

    @Override
    public void windowActivated(WindowEvent e) {
    }

    @Override
    public void windowDeactivated(WindowEvent e) {
    }
}
