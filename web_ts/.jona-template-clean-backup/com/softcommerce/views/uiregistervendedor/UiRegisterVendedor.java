package com.softcommerce.views.uiregistervendedor;


import com.softcommerce.formularios.*;
import com.izforge.izpack.gui.FlowLayout;
import com.softcommerce.beans.AnexoActivacion;
import com.softcommerce.beans.Nacionalidad;
import com.softcommerce.beans.BeanTipoDocIden;
import com.softcommerce.beans.Trabajador;
import com.softcommerce.beans.Usuario;
import com.softcommerce.beans.BeanVendedor;
import com.softcommerce.general.controles.ComponentToolKit;
import java.awt.Component;
import java.awt.event.FocusEvent;
import com.softcommerce.general.controles.JHDialog;
import java.awt.event.MouseEvent;
import java.awt.event.WindowEvent;
import javax.swing.JPanel;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.Color;
import java.awt.Font;
import java.awt.Dimension;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.CRadioButton;
import com.softcommerce.general.controles.CScrollPane;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.CTextArea;
import com.softcommerce.general.controles.IntegerDocument;
import static com.softcommerce.general.controles.Register.INSERT;
import static com.softcommerce.general.controles.Register.UPDATE;
import com.softcommerce.general.controles.UpperCaseDocument;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.tablas.AnexoActivacionTableModel;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnVendedor;
import java.awt.BorderLayout;
import java.awt.Dialog;
import java.awt.Frame;
import java.awt.event.FocusListener;
import java.awt.event.MouseListener;
import java.awt.event.WindowListener;
import java.util.ArrayList;
import java.util.List;
import javax.swing.ButtonGroup;
import javax.swing.JTextField;
import javax.swing.JComboBox;
import javax.swing.JOptionPane;
import javax.swing.JTabbedPane;
import javax.swing.border.EmptyBorder;
import javax.swing.border.LineBorder;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
import javax.swing.event.TableModelEvent;
import javax.swing.event.TableModelListener;
import com.softcommerce.reglasnegocio.RnAnexo;
import com.softcommerce.reglasnegocio.RnNacionalidad;
import com.softcommerce.reglasnegocio.RnTipoDocIden;
import com.softcommerce.util.render.CellRendererImageEstado;
import com.softcommerce.util.ExceptionHandler;
import com.toedter.calendar.JDateChooser;
import java.text.SimpleDateFormat;
import javax.swing.BoxLayout;
import javax.swing.JButton;
import javax.swing.JCheckBox;
import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JScrollPane;
import javax.swing.JToolBar;
import javax.swing.SwingConstants;
import javax.swing.table.TableRowSorter;
import org.apache.log4j.Logger;

public class UiRegisterVendedor extends JHDialog implements InterUiRegisterVendedor, ActionListener, ItemListener, KeyListener, WindowListener, MouseListener, FocusListener, TableModelListener, ListSelectionListener {

    protected ButtonGroup bg_TipoPersona;
    protected CRadioButton rb_TipoPersonaNatural;
    protected CRadioButton rb_TipoPersonaJuridica;
    protected CRadioButton rb_TipoPersonaNinguno;
    protected JTextField txt_Codigo;
    protected JTextField txt_ApePaterno;
    protected JTextField txt_ApeMaterno;
    protected JTextField txt_Nombre;
    protected JTextField txt_codigo_trabajador;
    protected JTextField txt_NumDoc;
    protected JTextField txt_TelFijo;
    protected JTextField txt_TelMovil;
    protected JTextField txt_Direccion;
    protected JTextField txt_Id_Empresa;
    protected JTextField txt_Id_TipoAnexo;
    protected JComboBox cb_TipoDocIden;
    protected List<BeanTipoDocIden> xtipodociden;
    protected JComboBox cb_Nacionalidad;
    protected List<Nacionalidad> xnacionalidad;
    //tania
    protected JCheckBox chk_credito;
    protected JCheckBox chk_contado;
    protected CTextArea txta_Comentario;
    protected CScrollPane jsp_Comentario;
    protected String numdoc;
    protected Gif gif;
    protected boolean saliodelTab;
    protected JTabbedPane tabb;
    protected Usuario usuario;
    protected JButton btnActivarVendedor;
    protected JButton btnDesactivarVendedor;
    public CTable tableAnexoActivacion;
    public AnexoActivacionTableModel modeltableAnexoActivacion;
    public TableRowSorter modeloOrdenadoAnexoActivacion;
    protected JScrollPane scrollAnexoActivacion;
    protected JButton btnCargarTrabajador;
    Frame arg0;
    protected Trabajador trabajador;
    protected final Logger logger = Logger.getLogger(UiRegisterVendedor.class);

    public UiRegisterVendedor(Dialog arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    public UiRegisterVendedor(Frame arg0, Usuario usuario) {
        super(arg0);
        this.arg0 = arg0;
        this.usuario = usuario;
        inicialize();
    }

    protected void inicialize() {
        gif = new Gif();

        addWindowListener(this);

        JPanel pnl_dialog = new JPanel();
        pnl_dialog.setLayout(null);
        pnl_dialog.setBackground(new Color(245, 245, 245));

        tabb = new JTabbedPane();
        tabb.addKeyListener(this);
        tabb.addFocusListener(this);

        tabb.addTab("General", getPanel1());

        JPanel pnlComentario = new JPanel();
        pnlComentario.setBackground(new Color(245, 245, 245));
        pnlComentario.setLayout(new BorderLayout());
        pnlComentario.setBorder(new EmptyBorder(20, 20, 20, 20));

        CLabel lbl_Comentario = new CLabel("Comentarios :");
        pnlComentario.add(lbl_Comentario, "North");

        txta_Comentario = new CTextArea();
        txta_Comentario.addKeyListener(this);

        jsp_Comentario = new CScrollPane();
        jsp_Comentario.getViewport().add(txta_Comentario);
        pnlComentario.add(this.jsp_Comentario, "Center");

//        tabb.addTab("Comentarios", pnlComentario);
        tabb.setBounds(10, 10, 815, 375);
        pnl_dialog.add(tabb);

        tabb.addTab("Activación Vendedor", getPanelActivacion());
        setTitleName("Vendedor");
        setRegister(pnl_dialog);
        setSize(new Dimension(860, 470));
        ComponentToolKit.centerComponentPosicion(this);
    }

    protected JPanel getPanelActivacion() {
        JPanel pnlActivacion = new JPanel(new BorderLayout());
        pnlActivacion.setLayout(new BorderLayout(0, 0));
        pnlActivacion.setBackground(new Color(245, 245, 245));
        JToolBar toolbar = new JToolBar();
        toolbar.setBackground(new Color(245, 245, 245));
        toolbar.setPreferredSize(new Dimension(0, 30));

        btnActivarVendedor = new JButton("Activar", gif.ADD16);
        btnActivarVendedor.setMnemonic('A');
        btnActivarVendedor.setHorizontalAlignment(SwingConstants.LEFT);
        btnActivarVendedor.setIconTextGap(10);
        btnActivarVendedor.addActionListener(this);
        btnActivarVendedor.setOpaque(false);
        btnActivarVendedor.addKeyListener(this);
        btnActivarVendedor.setFocusPainted(false);
        btnActivarVendedor.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btnActivarVendedor);

        toolbar.addSeparator();

        btnDesactivarVendedor = new JButton("Desactivar", gif.ELIMINATE16);
        btnDesactivarVendedor.setMnemonic('D');
        btnDesactivarVendedor.setHorizontalAlignment(SwingConstants.LEFT);
        btnDesactivarVendedor.setIconTextGap(10);
        btnDesactivarVendedor.addActionListener(this);
        btnDesactivarVendedor.setOpaque(false);
        btnDesactivarVendedor.addKeyListener(this);
        btnDesactivarVendedor.setFocusPainted(false);
        btnDesactivarVendedor.setFont(new Font(Font.SANS_SERIF, 0, 11));
        toolbar.add(btnDesactivarVendedor);

        pnlActivacion.add(toolbar, BorderLayout.NORTH);

        modeltableAnexoActivacion = new AnexoActivacionTableModel();
        modeloOrdenadoAnexoActivacion = new TableRowSorter(modeltableAnexoActivacion);
        tableAnexoActivacion = new CTable();
        tableAnexoActivacion.setRowSorter(modeloOrdenadoAnexoActivacion);
        tableAnexoActivacion.setModel(modeltableAnexoActivacion);
        tableAnexoActivacion.setAllTableNoEditable();
        tableAnexoActivacion.setAllColumnNoResizable();
        tableAnexoActivacion.setRendererColumnZero();
        tableAnexoActivacion.setAllColumnPreferredWidth();
        tableAnexoActivacion.getSelectionModel().addListSelectionListener(this);
        scrollAnexoActivacion = new JScrollPane(tableAnexoActivacion);
        scrollAnexoActivacion.setPreferredSize(new Dimension(1200, 380));

        List<AnexoActivacion> lista = new ArrayList<AnexoActivacion>();
        AnexoActivacion anexo_act = new AnexoActivacion();
//        if (mode == INSERT) {
        anexo_act.setEstado("A");
        anexo_act.setIdUsuario(usuario.getId_usuario());
        anexo_act.setMotivoActivacion("POR REGISTRO");
        anexo_act.setOperacion("I");
        anexo_act.setFechaInicio(Main.fechaActualServer);
        lista.add(anexo_act);
        tableAnexoActivacion.setNoVisibleColumn(2);
        modeltableAnexoActivacion.setAnexoActivacion(anexo_act);
        modeltableAnexoActivacion.fireTableDataChanged();
//        }
//
//         if(mode==INSERT){
        btnDesactivarVendedor.setEnabled(false);
        btnActivarVendedor.setEnabled(false);
//        }

        tableAnexoActivacion.getColumnModel().getColumn(0).setCellRenderer(new CellRendererImageEstado());
        pnlActivacion.add(scrollAnexoActivacion, BorderLayout.CENTER);
//        setSize(300,200);
//        ComponentToolKit.centerComponentPosicion(this);
//        setVisible(true);
        return pnlActivacion;
    }

    protected JPanel getPanelComentario() {
        JLabel label = new JLabel("Comentario");
        JPanel pnlComentario = new JPanel();
        pnlComentario.add(label, "North");
//
        txta_Comentario = new CTextArea();
        txta_Comentario.addKeyListener(this);

        jsp_Comentario = new CScrollPane();
        jsp_Comentario.getViewport().add(txta_Comentario);
        pnlComentario.add(this.jsp_Comentario, "Center");

        return pnlComentario;
    }

    protected JPanel getPanel1() {
        JPanel pnlGeneral = new JPanel();
        pnlGeneral.setLayout(null);
        pnlGeneral.setBackground(new Color(245, 245, 245));

        CLabel lbl_Codigo = new CLabel("Código");
        lbl_Codigo.setBounds(35, 25, 60, 20);
        pnlGeneral.add(lbl_Codigo);

        txt_Codigo = new JTextField();
        txt_Codigo.setBounds(105, 25, 120, 20);
        txt_Codigo.setEditable(false);
        txt_Codigo.addKeyListener(this);
        pnlGeneral.add(txt_Codigo);

        CLabel lbl_TipoPersona = new CLabel("Cargar Trabajador");
        lbl_TipoPersona.setBounds(35, 60, 120, 20);
//        lbl_TipoPersona.setVisible(false);
        pnlGeneral.add(lbl_TipoPersona);

        btnCargarTrabajador = new JButton("Buscar");
        btnCargarTrabajador.setBounds(150, 60, 120, 20);
        btnCargarTrabajador.addKeyListener(this);
        btnCargarTrabajador.addActionListener(this);
        pnlGeneral.add(btnCargarTrabajador);

        rb_TipoPersonaNatural = new CRadioButton("Natural");
        rb_TipoPersonaNatural.setBounds(150, 60, 120, 20);
        rb_TipoPersonaNatural.addKeyListener(this);
        rb_TipoPersonaNatural.addActionListener(this);
        rb_TipoPersonaNatural.addItemListener(this);
        rb_TipoPersonaNatural.setVisible(false);
        pnlGeneral.add(rb_TipoPersonaNatural);

        rb_TipoPersonaJuridica = new CRadioButton("Juridica");
        rb_TipoPersonaJuridica.setBounds(265, 60, 120, 20);
        rb_TipoPersonaJuridica.addKeyListener(this);
        rb_TipoPersonaJuridica.addActionListener(this);
        rb_TipoPersonaJuridica.addItemListener(this);
        rb_TipoPersonaJuridica.setVisible(false);
        pnlGeneral.add(rb_TipoPersonaJuridica);

        rb_TipoPersonaNinguno = new CRadioButton();
        rb_TipoPersonaNinguno.addKeyListener(this);

        bg_TipoPersona = new ButtonGroup();
        bg_TipoPersona.add(rb_TipoPersonaJuridica);
        bg_TipoPersona.add(rb_TipoPersonaNatural);
        bg_TipoPersona.add(rb_TipoPersonaNinguno);

        CLabel lbl_ApePaterno = new CLabel("Apellido Paterno");
        lbl_ApePaterno.setBounds(35, 95, 120, 20);
        pnlGeneral.add(lbl_ApePaterno);
        lbl_ApePaterno.setVisible(false);

        txt_ApePaterno = new JTextField();
        txt_ApePaterno.setBounds(150, 95, 120, 20);
        txt_ApePaterno.addFocusListener(this);
        txt_ApePaterno.setDocument(new UpperCaseDocument(180));
        txt_ApePaterno.addKeyListener(this);
        pnlGeneral.add(txt_ApePaterno);
        txt_ApePaterno.setVisible(false);

        CLabel lbl_ApeMaterno = new CLabel("Apellido Materno");
        lbl_ApeMaterno.setBounds(295, 95, 120, 20);
        pnlGeneral.add(lbl_ApeMaterno);
        lbl_ApeMaterno.setVisible(false);

        txt_ApeMaterno = new JTextField();
        txt_ApeMaterno.setBounds(390, 95, 130, 20);
        txt_ApeMaterno.setDocument(new UpperCaseDocument(180));
        txt_ApeMaterno.addFocusListener(this);
        txt_ApeMaterno.addKeyListener(this);
        pnlGeneral.add(txt_ApeMaterno);
        txt_ApeMaterno.setVisible(false);

        CLabel lbl_Nombre = new CLabel("Nombres");
//        lbl_Nombre.setBounds(150, 95, 320, 20);
        lbl_Nombre.setBounds(35, 95, 120, 20);
        pnlGeneral.add(lbl_Nombre);

        txt_Nombre = new JTextField();
        txt_Nombre.setBounds(150, 95, 400, 20);
        txt_Nombre.addFocusListener(this);
        txt_Nombre.setDocument(new UpperCaseDocument(180));
        txt_Nombre.addKeyListener(this);
        txt_Nombre.setEditable(false);
        pnlGeneral.add(txt_Nombre);

        CLabel lbl_Direccion = new CLabel("Dirección");
        lbl_Direccion.setBounds(35, 165, 120, 20);
        pnlGeneral.add(lbl_Direccion);

        txt_Direccion = new JTextField();
        txt_Direccion.setBounds(150, 165, 500, 20);
        txt_Direccion.setDocument(new UpperCaseNumberDocument(280));
        txt_Direccion.addKeyListener(this);
        txt_Direccion.addFocusListener(this);
        pnlGeneral.add(txt_Direccion);

        CLabel lbl_Descripcion = new CLabel("Codigo Trab.");
        lbl_Descripcion.setBounds(35, 130, 120, 20);
        pnlGeneral.add(lbl_Descripcion);

        txt_codigo_trabajador = new JTextField();
        txt_codigo_trabajador.setBounds(150, 130, 120, 20);
        txt_codigo_trabajador.addKeyListener(this);
        txt_codigo_trabajador.addFocusListener(this);
        txt_codigo_trabajador.setDocument(new UpperCaseNumberDocument(300));
        pnlGeneral.add(txt_codigo_trabajador);

        CLabel lbl_TipoDocIden = new CLabel("Tipo de Documento");
        lbl_TipoDocIden.setBounds(35, 200, 120, 20);
        pnlGeneral.add(lbl_TipoDocIden);

        cb_TipoDocIden = new JComboBox();
        cb_TipoDocIden.setFont(new Font(Font.SANS_SERIF, 0, 9));
        cb_TipoDocIden.setBounds(150, 200, 300, 20);
        cb_TipoDocIden.addKeyListener(this);
        cb_TipoDocIden.addActionListener(this);
        pnlGeneral.add(cb_TipoDocIden);

        CLabel lbl_NumDoc = new CLabel("Numero");
        lbl_NumDoc.setBounds(465, 200, 60, 20);
        pnlGeneral.add(lbl_NumDoc);

        txt_NumDoc = new JTextField();
        txt_NumDoc.setBounds(525, 200, 120, 20);
        txt_NumDoc.addFocusListener(this);
        txt_NumDoc.addKeyListener(this);
        txt_NumDoc.setEditable(false);
        pnlGeneral.add(txt_NumDoc);

        CLabel lbl_TelFijo = new CLabel("Telefono Fijo");
        lbl_TelFijo.setBounds(35, 235, 120, 20);
        pnlGeneral.add(lbl_TelFijo);

        txt_TelFijo = new JTextField();
        txt_TelFijo.setBounds(150, 235, 120, 20);
        txt_TelFijo.addKeyListener(this);
        txt_TelFijo.addFocusListener(this);
        pnlGeneral.add(txt_TelFijo);

        CLabel lbl_TelMovil = new CLabel("Telefono Movil");
        lbl_TelMovil.setBounds(300, 235, 120, 20);
        pnlGeneral.add(lbl_TelMovil);

        txt_TelMovil = new JTextField();
        txt_TelMovil.setBounds(390, 235, 120, 20);
        txt_TelMovil.addKeyListener(this);
        txt_TelMovil.addFocusListener(this);
        pnlGeneral.add(txt_TelMovil);

        CLabel lbl_Nacionalidad = new CLabel("Nacionalidad");
        lbl_Nacionalidad.setBounds(35, 270, 120, 20);
        pnlGeneral.add(lbl_Nacionalidad);

        cb_Nacionalidad = new JComboBox();
        cb_Nacionalidad.setBounds(150, 270, 208, 20);
        cb_Nacionalidad.setFont(new Font(Font.SANS_SERIF, 0, 9));
        cb_Nacionalidad.addKeyListener(this);
//        cb_Nacionalidad.setVisible(false);
        pnlGeneral.add(cb_Nacionalidad);
        //tania
        CLabel lbl_tipo = new CLabel("Tipo");
//        lbl_tipo.setBounds(35, 305, 120, 20);
        lbl_tipo.setBounds(35, 305, 120, 20);
        pnlGeneral.add(lbl_tipo);

        chk_credito = new JCheckBox("Credito");
        chk_contado = new JCheckBox("Contado");

        chk_credito.setBounds(150, 305, 100, 20);
        chk_credito.setVisible(true);
        pnlGeneral.add(chk_credito);

        chk_contado.setBounds(300, 305, 208, 20);
        chk_contado.setVisible(true);
        chk_contado.setSelected(true);
        pnlGeneral.add(chk_contado);
        //
        txt_Id_TipoAnexo = new JTextField();
        txt_Id_TipoAnexo.setBounds(0, 0, 0, 0);
        txt_Id_TipoAnexo.setVisible(false);
        pnlGeneral.add(txt_Id_TipoAnexo);

        txt_Id_Empresa = new JTextField();
        txt_Id_Empresa.setBounds(0, 0, 0, 0);
        txt_Id_Empresa.setVisible(false);
        pnlGeneral.add(txt_Id_Empresa);

        return pnlGeneral;
    }

    @Override
    public void loadCombo() {
    }

    public void loadTipoDocIden() {
    }

    public void loadNacionalidad() {
    }

    @Override
    public void newRegister() {
    }

    @Override
    public String executeInsert() {
        return null;
    }

    public BeanVendedor llenarVendedor(String opcion) {

        SimpleDateFormat fe = new SimpleDateFormat("dd/MM/yyyy");
        BeanTipoDocIden doc = new BeanTipoDocIden();
        if (trabajador == null) {
            trabajador = new Trabajador();
            trabajador.setId_trabajador(txt_codigo_trabajador.getText());
        }
        BeanVendedor vendedor = new BeanVendedor();
        vendedor.setID_VENDEDOR(txt_Codigo.getText());
        vendedor.setNOMBRES(txt_Nombre.getText());
        vendedor.setDIRECCION(txt_Direccion.getText());
        trabajador.setTelefono(txt_TelFijo.getText());
        trabajador.setCelular(txt_TelMovil.getText());
        vendedor.setTELEFONO(txt_TelFijo.getText());
        vendedor.setCELULAR(txt_TelMovil.getText());
        vendedor.setTRABAJADOR(trabajador);
        vendedor.setNUMERO(txt_NumDoc.getText());
        vendedor.setUSUARIO(usuario);
        vendedor.setFLAG_CREDITO((chk_credito.isSelected() ? "S" : "N"));
        vendedor.setFLAG_CONTADO((chk_contado.isSelected() ? "S" : "N"));
        doc.setId_tipo_doc("01");
        vendedor.setNACIONALIDAD(xnacionalidad.get(cb_Nacionalidad.getSelectedIndex() - 1));
        vendedor.setTIPO_DOC(doc);
        vendedor.setTIPO_OPERACION(opcion);
        int is = modeltableAnexoActivacion.getRowCount();
        AnexoActivacion anexo = modeltableAnexoActivacion.getAnexoActivacion(
                modeltableAnexoActivacion.getRowCount() - 1);
        vendedor.setESTADO(anexo.getEstado());

        String xmlActivacion = "";
        xmlActivacion = "<?xml version=\"1.0\" ?> ";

        xmlActivacion += "<ACTIVACIONES>";
        for (int i = 0; i < modeltableAnexoActivacion.getRowCount(); i++) {
            AnexoActivacion beanAnexoActivacion = modeltableAnexoActivacion.getAnexoActivacion(i);
            xmlActivacion += "<ACTIVACION>";
            xmlActivacion += "<ID_ACTIVACION>" + beanAnexoActivacion.getIdActivacion() + "</ID_ACTIVACION>";
            xmlActivacion += "<F_INICIO>" + fe.format(beanAnexoActivacion.getFechaInicio()) + "</F_INICIO>";
            xmlActivacion += "<F_FIN>" + ((beanAnexoActivacion.getFechaFin() == null) ? beanAnexoActivacion.getFechaFin() : fe.format(beanAnexoActivacion.getFechaFin())) + "</F_FIN>";
            xmlActivacion += "<ESTADO>" + beanAnexoActivacion.getEstado() + "</ESTADO>";
            xmlActivacion += "<MOTIVO_ACTIVACION>" + beanAnexoActivacion.getMotivoActivacion() + "</MOTIVO_ACTIVACION>";
            xmlActivacion += "<MOTIVO_DESACTIVACION>" + ((beanAnexoActivacion.getMotivoDesactivacion() == null) ? "" : beanAnexoActivacion.getMotivoDesactivacion()) + "</MOTIVO_DESACTIVACION>";
            xmlActivacion += "<OPERACION>" + beanAnexoActivacion.getOperacion() + "</OPERACION>";
            xmlActivacion += "</ACTIVACION>";
        }
        xmlActivacion += "</ACTIVACIONES>";
        System.out.println("xml_activacion: " + xmlActivacion);
        vendedor.setXmlActivacion(xmlActivacion);
        return vendedor;
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getComponent() == tabb) {
            saliodelTab = false;
        }

        if (e.getComponent() == txt_ApePaterno) {
            txt_ApePaterno.selectAll();
        }

        if (e.getComponent() == txt_ApeMaterno) {
            txt_ApeMaterno.selectAll();
        }

        if (e.getComponent() == txt_Nombre) {
            txt_Nombre.selectAll();
        }

        if (e.getComponent() == txt_Direccion) {
            txt_Direccion.selectAll();
        }

        if (e.getComponent() == txt_codigo_trabajador) {
            txt_codigo_trabajador.selectAll();
        }

        if (e.getComponent() == txt_NumDoc) {
            txt_NumDoc.selectAll();
        }

        if (e.getComponent() == txt_TelFijo) {
            txt_TelFijo.selectAll();
        }

        if (e.getComponent() == txt_TelMovil) {
            txt_TelMovil.selectAll();
        }
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            dispose();
        }

        if (e.getKeyChar() == '\n') {
            if (tabb.getSelectedIndex() == 0) {
                if (!saliodelTab) {
                    rb_TipoPersonaNatural.requestFocus();
                    saliodelTab = true;
                }
            }

            if (e.getSource() == rb_TipoPersonaNatural) {
                rb_TipoPersonaJuridica.requestFocus();
            }

            if (e.getSource() == rb_TipoPersonaJuridica) {
                if (txt_ApePaterno.isEditable()) {
                    txt_ApePaterno.requestFocus();
                } else {
                    txt_codigo_trabajador.requestFocus();
                }
            }

            if (e.getSource() == txt_ApePaterno) {
                txt_ApeMaterno.requestFocus();
            }

            if (e.getSource() == txt_ApeMaterno) {
                txt_Nombre.requestFocus();
            }

            if (e.getSource() == txt_Nombre) {
                txt_Direccion.requestFocus();
            }

            if (e.getSource() == txt_codigo_trabajador) {
                txt_Direccion.requestFocus();
            }

            if (e.getSource() == txt_Direccion) {
                cb_TipoDocIden.requestFocus();
            }

            if (e.getSource() == cb_TipoDocIden) {
                if (txt_NumDoc.isEditable()) {
                    txt_NumDoc.requestFocus();
                } else {
                    txt_TelFijo.requestFocus();
                }
            }

            if (e.getSource() == txt_NumDoc) {
                txt_TelFijo.requestFocus();
            }

            if (e.getSource() == txt_TelFijo) {
                txt_TelMovil.requestFocus();
            }

            if (e.getSource() == txt_TelMovil) {
                cb_Nacionalidad.requestFocus();
            }

            if (e.getSource() == cb_Nacionalidad) {
                setFocusAndClick();
            }

            if (tabb.getSelectedIndex() == 1) {
                txta_Comentario.requestFocus();
            }
        } else if (e.getKeyChar() == KeyEvent.VK_SPACE) {
            if (e.getSource() == rb_TipoPersonaNatural) {
                rb_TipoPersonaNatural.setSelected(true);
                txt_ApePaterno.requestFocus();
            }

            if (e.getSource() == rb_TipoPersonaJuridica) {
                rb_TipoPersonaJuridica.setSelected(true);
                txt_codigo_trabajador.requestFocus();
            }
        }
    }

    @Override
    public boolean isRegisterValid() {
        return false;
    }

    @Override
    public boolean loadRegister() {
        return false;
    }

    public void cargarTipoDocIden(String xcodiTipodocIden) {
    }

    public void cargarNacionalidad(String xcodnacionalidad) {
    }

    @Override
    public String executeUpdate() {
        return null;
    }

    @Override
    public boolean executeDelete() {
        return false;
    }

    @Override
    public void actionPerformed(ActionEvent e) {

        if (e.getSource() == btnCargarTrabajador) {
            PanelCargarTrabajador pnlTrabajador = new PanelCargarTrabajador(arg0, this, usuario, path);
            txt_Nombre.setEditable(false);
            txt_Direccion.setEditable(false);
//            pnlTrabajador.cargarTabla();
        }
        if (e.getSource() == cb_TipoDocIden) {
            if (cb_TipoDocIden.getItemCount() > 0) {
                txt_NumDoc.setDocument(cb_TipoDocIden.getSelectedItem().equals("DNI") ? new IntegerDocument(8) : (cb_TipoDocIden.getSelectedItem().equals("RUC") ? new IntegerDocument(11) : new JTextField().getDocument()));

                if (cb_TipoDocIden.getSelectedIndex() > -1) {
                    if ((mode == UPDATE) || (mode == INSERT) || (mode == CLONE)) {
                        txt_NumDoc.setEditable(true);
                    }
                } else {
                    txt_NumDoc.setEditable(false);
                }
            }
        }
        if (e.getSource() == btnDesactivarVendedor) {
            if (modeltableAnexoActivacion.getRowCount() > 0) {
                ventanaDesactivar();
            }
        }
        if (e.getSource() == btnActivarVendedor) {
            if (modeltableAnexoActivacion.getRowCount() > 0) {
                ventanaActivar();
            }
        }
        if (e.getSource() == btnAceptarDesac) {

            if (txtMotivoDeasctivacion.getText().equals("")) {
                JOptionPane.showMessageDialog(this, "Debe llenar el motivo de desactivación");
                dialogoDes.dispose();
            } else {
                int ind = tableAnexoActivacion.getRowCount() - 1;
                //tania         
                AnexoActivacion anexoA = modeltableAnexoActivacion.getAnexoActivacion(ind);
                anexoA.setMotivoDesactivacion(txtMotivoDeasctivacion.getText());
                anexoA.setFechaFin(new java.sql.Date(fechaDes.getDate().getTime()));
                anexoA.setOperacion("U");//          
                anexoA.setEstado("D");
                modeltableAnexoActivacion.setAnexoActivacion(anexoA, ind);
                dialogoDes.dispose();
            }
        }
        if (e.getSource() == btnAceptarAct) {

            if (txtMotivoActivacion.getText().equals("")) {
                JOptionPane.showMessageDialog(this, "Debe llenar el motivo de activacion");
                dialogoAct.dispose();
            } else {
                int ind = tableAnexoActivacion.getSelectedRow();
                AnexoActivacion anexo = new AnexoActivacion();
                anexo.setFechaInicio(new java.sql.Date(fechaAct.getDate().getTime()));
                anexo.setMotivoActivacion(txtMotivoActivacion.getText());
                anexo.setEstado("A");
                anexo.setOperacion("I");
//                modeltableAnexoActivacion.add           
                modeltableAnexoActivacion.setAnexoActivacion(anexo);
                modeltableAnexoActivacion.fireTableDataChanged();
                dialogoAct.dispose();
            }
        }
        if (e.getSource() == btnCancelarDesac) {
            dialogoDes.dispose();
        }
        if (e.getSource() == btnCancelarAct) {
            dialogoAct.dispose();
        }
    }
    JButton btnAceptarDesac = new JButton("Aceptar");
    JButton btnCancelarDesac = new JButton("Cancelar");
    JTextField txtMotivoDeasctivacion = new JTextField(20);
    JDateChooser fechaDes = new JDateChooser();
    JDialog dialogoDes = null;
    JButton btnAceptarAct = new JButton("Aceptar");
    JButton btnCancelarAct = new JButton("Cancelar");
    JTextField txtMotivoActivacion = new JTextField(20);
    JDateChooser fechaAct = new JDateChooser();
    JDialog dialogoAct = null;

    protected void ventanaActivar() {
        dialogoAct = new JDialog();

        JPanel panelGeneral = new JPanel();
        panelGeneral.setLayout(new BoxLayout(panelGeneral, BoxLayout.Y_AXIS));
        JPanel panel1 = new JPanel();
        panel1.setLayout(new FlowLayout());
        JPanel panel2 = new JPanel();
        panel2.setLayout(new FlowLayout());
        JPanel panel3 = new JPanel();
        panel3.setLayout(new FlowLayout());

        JLabel lblFecha = new JLabel("Fecha");
        JLabel lblMotivoDe = new JLabel("Motivo Activacion");
        txtMotivoActivacion.setSize(90, 20);
        panel1.add(lblMotivoDe);
//        panel1.setSize(200, 70);
        panel1.add(txtMotivoActivacion);
        panel2.add(lblFecha);
        panel2.add(fechaAct);
        fechaAct.setDate(Main.fechaActualServer);
        btnAceptarAct.addActionListener(this);
        btnCancelarAct.addActionListener(this);

        panel3.add(btnAceptarAct);
        panel3.add(btnCancelarAct);
        panelGeneral.add(panel1);
        panelGeneral.add(panel2);
        panelGeneral.add(panel3);
        dialogoAct.add(panelGeneral);
        dialogoAct.setSize(350, 170);
        dialogoAct.setLocationRelativeTo(this);
        dialogoAct.setModal(true);
        dialogoAct.setVisible(true);

    }

    protected void ventanaDesactivar() {

        dialogoDes = new JDialog();
        JPanel panelGeneral = new JPanel();
        panelGeneral.setLayout(new BoxLayout(panelGeneral, BoxLayout.Y_AXIS));
        JPanel panel1 = new JPanel();
        panel1.setLayout(new FlowLayout());
        JPanel panel2 = new JPanel();
        panel2.setLayout(new FlowLayout());
        JPanel panel3 = new JPanel();
        panel3.setLayout(new FlowLayout());

        JLabel lblFecha = new JLabel("Fecha");
        JLabel lblMotivoDe = new JLabel("Motivo");
        txtMotivoDeasctivacion.setSize(90, 20);
        txtMotivoDeasctivacion.setText("");
        panel1.add(lblMotivoDe);
        panel1.add(txtMotivoDeasctivacion);

        panel2.add(lblFecha);
        panel2.add(fechaDes);
        fechaDes.setDate(Main.fechaActualServer);
        btnAceptarDesac.addActionListener(this);
        btnCancelarDesac.addActionListener(this);

        panel3.add(btnAceptarDesac);
        panel3.add(btnCancelarDesac);

        panelGeneral.add(panel1);
        panelGeneral.add(panel2);
        panelGeneral.add(panel3);
        dialogoDes.add(panelGeneral);
//        panel3.setSize(300, 100);

//        dialogoDes.setLayout(new BoxLayout(dialogoDes, BoxLayout.Y_AXIS));
//        panelGeneral.setSize(320, 170);
        dialogoDes.setSize(350, 170);
        dialogoDes.setLocationRelativeTo(this);
        dialogoDes.setModal(true);
        dialogoDes.setVisible(true);

    }
//    JTextField txtFechaDes = new JTextField();

    @Override
    public void setRegisterEnabled(boolean e) {
        cb_Nacionalidad.setEnabled(e);
        cb_TipoDocIden.setEnabled(e);
        rb_TipoPersonaJuridica.setEnabled(e);
        rb_TipoPersonaNatural.setEnabled(e);
    }

    @Override
    public void setRegisterEditable(boolean e) {
        txt_ApeMaterno.setEditable(e);
        txt_ApePaterno.setEditable(e);
        txt_codigo_trabajador.setEditable(e);
        txt_Direccion.setEditable(e);
//        txt_Nombre.setEditable(e);
//        txt_NumDoc.setEditable(e);
        txt_TelFijo.setEditable(e);
        txt_TelMovil.setEditable(e);
        txta_Comentario.setEditable(e);
    }

    @Override
    public void keyReleased(KeyEvent e) {
//        if (e.getSource() == txt_ApeMaterno || e.getSource() == txt_ApePaterno || e.getSource() == txt_Nombre) {
//            String descripcionT = txt_ApePaterno.getText().trim() + " " + txt_ApeMaterno.getText().trim() + " " + txt_Nombre.getText().trim();
//
//            txt_codigo_trabajador.setText(descripcionT);
//        }
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
        boolean is_Selected;

        is_Selected = (e.getStateChange() == ItemEvent.SELECTED);

        if (e.getItemSelectable() == rb_TipoPersonaJuridica) {
            if (is_Selected) {
                activarCamposDatos(false);
            }
        }

        if (e.getItemSelectable() == rb_TipoPersonaNatural) {
            if (is_Selected) {
                activarCamposDatos(true);
            }
        }
    }

    protected void activarCamposDatos(boolean e) {
        JTextField txt = new JTextField();
        txt_ApePaterno.setBorder(txt.getBorder());
        txt_Nombre.setBorder(txt.getBorder());
        txt_codigo_trabajador.setBorder(txt.getBorder());
        txt_NumDoc.setBorder(txt.getBorder());
        cb_TipoDocIden.setBorder(txt.getBorder());
        rb_TipoPersonaJuridica.setForeground(txt.getForeground());
        rb_TipoPersonaNatural.setForeground(txt.getForeground());

        txt_ApeMaterno.setText("");
        txt_ApePaterno.setText("");
        txt_Nombre.setText("");
        txt_codigo_trabajador.setText("");

        if (mode == INSERT || mode == UPDATE || mode == CLONE) {
            txt_ApeMaterno.setEditable(e);
            txt_ApePaterno.setEditable(e);
            txt_Nombre.setEditable(e);
            txt_codigo_trabajador.setEditable(!e);
        }
    }

    @Override
    public void windowOpened(WindowEvent e) {
        txt_ApePaterno.requestFocus();
    }

    @Override
    @SuppressWarnings("unchecked")
    public void setValueSearch(Object valor, Component comp) {
//        int codigo = (Integer) valor;
        this.trabajador = (Trabajador) valor;
        this.txt_Nombre.setText(trabajador.getNombre());
        this.txt_Direccion.setText(trabajador.getDireccion());
        this.txt_NumDoc.setText(String.valueOf(trabajador.getDni()));
        this.txt_TelFijo.setText(trabajador.getTelefono());
        this.txt_TelMovil.setText(trabajador.getCelular());
        this.txt_codigo_trabajador.setText(trabajador.getId_trabajador());

    }

    @Override
    public void focusLost(FocusEvent e) {
    }

    @Override
    public void showMessageSuccessfulUpdate() {
    }

    @Override
    public void showMessageSuccessfulDelete() {
    }

    @Override
    public void showMessageErrorInsert() {
    }

    @Override
    public void showMessageErrorUpdate() {
    }

    @Override
    public void showMessageErrorDelete() {
    }

    @Override
    public boolean executeAnular() {
        return false;
    }

    @Override
    public boolean executeSelect() {
        return false;
    }

    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void windowClosing(WindowEvent e) {
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

    @Override
    public void mouseClicked(MouseEvent e) {
    }

    @Override
    public void mousePressed(MouseEvent e) {
    }

    @Override
    public void mouseReleased(MouseEvent e) {
    }

    @Override
    public void showMessagePrint(String codigo) {
    }

    @Override
    public void mouseEntered(MouseEvent e) {
    }

    @Override
    public void mouseExited(MouseEvent e) {
    }

    public void executeQuitar(Object ob, ActionEvent e) {
    }

    public void executeEditar(Object ob, ActionEvent e) {
    }

    public void executeEditar(Object ob, MouseEvent e) {
    }

    public void executeDetalle(Object ob, ActionEvent E) {
    }

    public void executeAgregar(ActionEvent e) {
    }

    public void executeExit() {
    }

    public void onFocusOKB(int boton) {
    }

    @Override
    public void showMessageSuccessfulInsert() {
    }

    @Override
    public void tableChanged(TableModelEvent e) {
    }

    @Override
    public void valueChanged(ListSelectionEvent e) {
    }

    @Override
    public boolean loadRegister(Object o) {
        return false;
    }
}
