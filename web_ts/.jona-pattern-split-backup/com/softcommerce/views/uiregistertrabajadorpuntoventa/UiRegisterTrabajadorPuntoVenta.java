package com.softcommerce.views.uiregistertrabajadorpuntoventa;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Empresa;
import com.softcommerce.beans.Localidad;
import com.softcommerce.beans.PuntoVenta;
import com.softcommerce.beans.Trabajador;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CComboBox;
import com.softcommerce.general.controles.ComponentToolKit;
import java.awt.Component;
import com.softcommerce.general.controles.JHDialog;
import javax.swing.JPanel;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;
import javax.swing.BorderFactory;
import java.awt.event.KeyListener;
import java.awt.Color;
import java.awt.Font;
import javax.swing.border.Border;
import javax.swing.border.TitledBorder;
import java.awt.Dimension;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.CRadioButton;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.iconos.Gif;
import com.softcommerce.general.controles.Register;
import java.awt.Frame;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.Vector;
import javax.swing.ButtonGroup;
import javax.swing.JButton;
import javax.swing.JTextField;
import javax.swing.JComboBox;
import javax.swing.JComponent;
import javax.swing.JFormattedTextField;
import javax.swing.JOptionPane;
import javax.swing.KeyStroke;
import javax.swing.border.LineBorder;
import com.softcommerce.reglasnegocio.RnEmpresa;
import com.softcommerce.reglasnegocio.RnLocalidad;
import com.softcommerce.reglasnegocio.RnPuntoVenta;
import com.softcommerce.reglasnegocio.RnTrabajador;
import com.softcommerce.reglasnegocio.rn_TrabajadorPuntoVenta;
import java.util.List;
import javax.swing.JCheckBox;

public class UiRegisterTrabajadorPuntoVenta extends JHDialog implements InterUiRegisterTrabajadorPuntoVenta, ActionListener, ItemListener, KeyListener, FocusListener, Register {

    //private Vector vtrTipoTrabajador;
    private JComboBox cb_TipoTrabajador;
    private JTextField txt_Codigo;
    private JTextField txt_CodigoTrabajador;
    private JTextField txt_Nombre;
    private JTextField txt_Direccion;
    private ButtonGroup bg_Sexo;
    private CRadioButton rb_SexoMasculino;
    private CRadioButton rb_SexoFemenino;
    private CRadioButton rb_SexoNinguno;
    private JFormattedTextField txt_FecNac;
    private JTextField txt_Email;
    private JTextField txt_DNI;
    private JTextField txt_TelFijo;
    private JTextField txt_TelMovil;
    //private Vector<BeanTipoTrabajador> xtipotrabajador;
    private JTextField txt_estado;
    private SimpleDateFormat formato;
    private Usuario usuario;
    private JTextField txtEmpresa;
    private Gif gif;
    private JButton cbBuscarTrabajador;
    private CComboBox cbLocali;
    private Vector vtrLocalidad;
    private CComboBox cb_PuntoVenta;
    private Vector vtrPuntoVenta;
    private Vector<PuntoVenta> xpuntoventa;
    private Vector<Localidad> xlocali;
    private ArrayList xempres;
    private Vector vtrEmpresa;
    private JComboBox cb_Empresa;
    private Vector<Empresa> xempresa;
    private String id_trabajador;
    private String id_puntoventa;
    private JCheckBox chkHabilitar;

    public UiRegisterTrabajadorPuntoVenta(Frame arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    private void inicialize() {
        formato = new SimpleDateFormat("dd/MM/yyyy");

        gif = new Gif();

        JPanel pnl_dialog = new JPanel();
        pnl_dialog.setLayout(null);
        pnl_dialog.setBackground(new Color(245, 245, 245));

        Border border = BorderFactory.createTitledBorder(null, " Datos de Trabajador ", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Verdana", 0, 13), Color.BLACK);

        JPanel pnl_TRABAJADOR = new JPanel();
        pnl_TRABAJADOR.setBackground(new Color(245, 245, 245));
        pnl_TRABAJADOR.setBorder(border);
        pnl_TRABAJADOR.setLayout(null);

        CLabel lbl_Codigo = new CLabel("Código");
        lbl_Codigo.setBounds(35, 45, 40, 20);
        pnl_TRABAJADOR.add(lbl_Codigo);

        txt_Codigo = new JTextField();
        txt_Codigo.setEditable(false);
        txt_Codigo.setBounds(130, 45, 90, 20);
        pnl_TRABAJADOR.add(txt_Codigo);

        CLabel lbl_Nombre = new CLabel("Trabajador");
        lbl_Nombre.setBounds(35, 80, 60, 20);
        pnl_TRABAJADOR.add(lbl_Nombre);

        txt_CodigoTrabajador = new JTextField();
        txt_CodigoTrabajador.setEditable(false);
        txt_CodigoTrabajador.setBounds(130, 80, 50, 20);
        pnl_TRABAJADOR.add(txt_CodigoTrabajador);

        txt_Nombre = new JTextField();
        txt_Nombre.setBounds(183, 80, 250, 20);
        txt_Nombre.addKeyListener(this);
        txt_Nombre.addFocusListener(this);
        txt_Nombre.setEditable(false);
        txt_Nombre.setDocument(new UpperCaseNumberDocument(100));
        pnl_TRABAJADOR.add(txt_Nombre);

        cbBuscarTrabajador = new JButton(gif.SEARCH16);
        cbBuscarTrabajador.setBounds(440, 80, 40, 20);
        cbBuscarTrabajador.setToolTipText("Buscar contribuyente");
        cbBuscarTrabajador.setContentAreaFilled(true);
        cbBuscarTrabajador.setBorderPainted(true);
        cbBuscarTrabajador.setFocusable(true);
        cbBuscarTrabajador.setFocusPainted(false);
        cbBuscarTrabajador.addActionListener(this);
        cbBuscarTrabajador.addKeyListener(this);
        KeyStroke keystroke1 = KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false);
        ActionListener action1 = new ActionListener() {
            public void actionPerformed(ActionEvent e) {
            }
        };
        cbBuscarTrabajador.registerKeyboardAction(action1, keystroke1, JComponent.WHEN_FOCUSED);
        pnl_TRABAJADOR.add(this.cbBuscarTrabajador);

        CLabel lbl_Empresa = new CLabel("Empresa");
        lbl_Empresa.setBounds(35, 115, 100, 20);
        pnl_TRABAJADOR.add(lbl_Empresa);

        vtrEmpresa = new Vector();
        cb_Empresa = new JComboBox(vtrEmpresa);
        cb_Empresa.addKeyListener(this);
        cb_Empresa.addActionListener(this);
        cb_Empresa.setBounds(130, 115, 210, 20);
        pnl_TRABAJADOR.add(cb_Empresa);

        CLabel lbl_Localidad = new CLabel("Localidad");
        lbl_Localidad.setBounds(35, 150, 50, 20);
        pnl_TRABAJADOR.add(lbl_Localidad);

        vtrLocalidad = new Vector();
        cbLocali = new CComboBox(vtrLocalidad);
        cbLocali.setBounds(130, 150, 190, 20);
        cbLocali.addActionListener(this);
        cbLocali.setEnabled(false);
        cbLocali.addKeyListener(this);
        pnl_TRABAJADOR.add(cbLocali);

        CLabel lbl_LocalDespacho = new CLabel("Punto de Venta");
        lbl_LocalDespacho.setBounds(35, 185, 80, 20);
        pnl_TRABAJADOR.add(lbl_LocalDespacho);

        vtrPuntoVenta = new Vector();
        cb_PuntoVenta = new CComboBox(vtrPuntoVenta);
        cb_PuntoVenta.setBounds(130, 185, 210, 20);
        cb_PuntoVenta.addActionListener(this);
        cb_PuntoVenta.setEnabled(false);
        cb_PuntoVenta.addKeyListener(this);
        pnl_TRABAJADOR.add(cb_PuntoVenta);

        CLabel lbl_habilitar = new CLabel("Habilitar");
        lbl_habilitar.setBounds(35, 220, 80, 20);
        pnl_TRABAJADOR.add(lbl_habilitar);

        chkHabilitar = new JCheckBox();
        chkHabilitar.setBounds(130, 220, 210, 20);
        chkHabilitar.addActionListener(this);
        chkHabilitar.addKeyListener(this);

        pnl_TRABAJADOR.add(chkHabilitar);

        pnl_TRABAJADOR.setBounds(25, 25, 495, 270);
        pnl_dialog.add(pnl_TRABAJADOR);

        setTitleName("Item");
        setRegister(pnl_dialog);
        setSize(new Dimension(545, 380));
        ComponentToolKit.centerComponentPosicion(this);
    }

    public void loadCombo() {
        loadEmpresa();
    }

    public void loadEmpresa() {
        try {
            RnEmpresa regla_Empresa = new RnEmpresa(path);

            if (xempresa != null) {
                xempresa.clear();
            } else {
                xempresa = new Vector<Empresa>();
            }

            xempresa.addAll(regla_Empresa.listarEmpresa(""));

            vtrEmpresa.removeAllElements();
            vtrEmpresa.addElement("--- Seleccione una Empresa ---");

            for (int i = 0; i < xempresa.size(); i++) {
                vtrEmpresa.addElement(xempresa.get(i).getNombre());
            }

            cb_Empresa.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadLocalidad(String xcodEmpres) {
        try {
            RnLocalidad regla_Localidad = new RnLocalidad(path);

            if (xlocali != null) {
                xlocali.clear();
            } else {
                xlocali = new Vector<Localidad>();
            }

            xlocali.addAll(regla_Localidad.listar("", xcodEmpres, "", "", ""));

            cbLocali.removeAllItems();
            vtrLocalidad.removeAllElements();
            vtrLocalidad.addElement("--- Seleccione una Localidad ---");

            for (int i = 0; i < xlocali.size(); i++) {
                vtrLocalidad.addElement(xlocali.get(i).getDescripcion());
            }

            cbLocali.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadPuntoVenta(String xcodLocalidad) {
        try {
            RnPuntoVenta regla_PuntoVenta = new RnPuntoVenta(path);

            if (xpuntoventa != null) {
                xpuntoventa.clear();
            } else {
                xpuntoventa = new Vector<PuntoVenta>();
            }

            xpuntoventa.addAll(regla_PuntoVenta.listar("", "", xcodLocalidad, "", "", "", "", ""));

            cb_PuntoVenta.removeAllItems();
            vtrPuntoVenta.removeAllElements();
            vtrPuntoVenta.addElement("--- Seleccione un Punto de Venta ---");

            for (int i = 0; i < xpuntoventa.size(); i++) {
                vtrPuntoVenta.addElement(xpuntoventa.get(i).getDescripcion_puntoventa());
            }

            cb_PuntoVenta.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void actionPerformed(ActionEvent e) {
        if (cbBuscarTrabajador == e.getSource()) {
            BuscarTrabajador search = search = new BuscarTrabajador(this, path);
            search.cargarTabla(cbBuscarTrabajador);
        }

        if (cb_Empresa == e.getSource()) {
            if (vtrEmpresa.size() != 0) {
                if (cb_Empresa.getSelectedIndex() == 0) {
                    cbLocali.removeAllItems();
                    cb_PuntoVenta.removeAllItems();
                    cbLocali.setEnabled(false);
                    cb_PuntoVenta.setEnabled(false);
                } else {
                    if (mode == UPDATE || mode == INSERT || mode == CLONE) {
                        cbLocali.setEnabled(true);
                    }

                    loadLocalidad(xempresa.get(cb_Empresa.getSelectedIndex() - 1).getId_empresa());
                }
            }
        }

        if (cbLocali == e.getSource()) {
            if (vtrLocalidad.size() != 0) {
                if (cbLocali.getSelectedIndex() == 0) {
                    cb_PuntoVenta.removeAllItems();
                    cb_PuntoVenta.setEnabled(false);
                } else {
                    if (mode == UPDATE || mode == INSERT || mode == CLONE) {
                        cb_PuntoVenta.setEnabled(true);
                    }

                    loadPuntoVenta(xlocali.get(cbLocali.getSelectedIndex() - 1).getId_localidad());
                }
            }
        }
    }

    public void setValueSearch(Object codigo, Component comp) {
        if (comp == cbBuscarTrabajador) {
            cargarTrabajador(codigo.toString());
        }
    }

    public void cargarTrabajador(String codigo) {
        try {
            RnTrabajador regla = new RnTrabajador(path);
            List<Trabajador> reg = regla.listarTrabajador(codigo);

            if ((reg != null) && (reg.size() > 0)) {
                txt_CodigoTrabajador.setText(reg.get(0).getId_trabajador());
                txt_Nombre.setText(reg.get(0).getNombre());
            }
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void newRegister() {
        JTextField txt = new JTextField();
        cb_Empresa.setBorder(txt.getBorder());
        cb_PuntoVenta.setBorder(txt.getBorder());
        cbLocali.setBorder(txt.getBorder());

        txt_Codigo.setText("");
        txt_CodigoTrabajador.setText("");
        txt_Nombre.setText("");

        cb_Empresa.setSelectedIndex(0);
    }

    public String executeInsert() {
        rn_TrabajadorPuntoVenta regla = new rn_TrabajadorPuntoVenta(path);

        return regla.insertar(txt_CodigoTrabajador.getText().trim(), cb_PuntoVenta.getSelectedIndex() > 0 ? xpuntoventa.get(cb_PuntoVenta.getSelectedIndex() - 1).getId_punto_venta() : "", usuario.getId_usuario(),
                chkHabilitar.isSelected() ? "S" : "N");
    }

    public boolean isRegisterValid() {
        JTextField txt = new JTextField();
        txt_Nombre.setBorder(txt.getBorder());
        cb_PuntoVenta.setBorder(txt.getBorder());
        cb_Empresa.setBorder(txt.getBorder());
        cbLocali.setBorder(txt.getBorder());

        if (txt_Nombre.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " un Trabajador, debes " + "especificar su Nombre.", "Datos incompletos del Trabajador", JOptionPane.CANCEL_OPTION);
            cbBuscarTrabajador.requestFocus();

            return false;
        }

        if (cb_Empresa.getSelectedIndex() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " un Correlativo, debes " + "especificar la Empresa.", "Datos incompletos de Correlativo", JOptionPane.CANCEL_OPTION);
            cb_Empresa.setBorder(new LineBorder(Color.RED));
            cb_Empresa.requestFocus();

            return false;
        }

        if (cbLocali.getSelectedIndex() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " un Correlativo, debes " + "especificar la Localidad.", "Datos incompletos de Correlativo", JOptionPane.CANCEL_OPTION);
            cbLocali.setBorder(new LineBorder(Color.RED));
            cbLocali.requestFocus();

            return false;
        }

        if (cb_PuntoVenta.getSelectedIndex() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " un Correlativo, debes " + "especificar su Punto de Venta.", "Datos incompletos de Correlativo", JOptionPane.CANCEL_OPTION);
            cb_PuntoVenta.setBorder(new LineBorder(Color.RED));
            cb_PuntoVenta.requestFocus();

            return false;
        }

        rn_TrabajadorPuntoVenta reg = new rn_TrabajadorPuntoVenta(path);
        boolean flag = reg.existeTrabajadorPV(txt_CodigoTrabajador.getText().trim(), xpuntoventa.get(cb_PuntoVenta.getSelectedIndex() - 1).getId_punto_venta()).trim().equals("S");
        if (((mode == INSERT) && flag)
                || ((mode == UPDATE) && flag && !txt_CodigoTrabajador.getText().trim().equals(id_trabajador) && xpuntoventa.get(cb_PuntoVenta.getSelectedIndex() - 1).getId_punto_venta().equals(id_puntoventa))) {
            JOptionPane.showMessageDialog(this, "El Trabajador ya se encuentra asignado al punto de venta especificado. Compruébala e inténtalo de nuevo", "Datos incompletos del Trabajador.", JOptionPane.CANCEL_OPTION);
            cbBuscarTrabajador.requestFocus();
            return false;
        }

        return true;
    }

    public String executeUpdate() {
        rn_TrabajadorPuntoVenta regla = new rn_TrabajadorPuntoVenta(path);

        return regla.modificar(txt_Codigo.getText().trim(), txt_CodigoTrabajador.getText().trim(), cb_PuntoVenta.getSelectedIndex() > 0 ? xpuntoventa.get(cb_PuntoVenta.getSelectedIndex() - 1).getId_punto_venta() : "", usuario.getId_usuario(),
                chkHabilitar.isSelected() ? "S" : "N");
    }

    public boolean executeDelete() {
        rn_TrabajadorPuntoVenta regla = new rn_TrabajadorPuntoVenta(path);

        System.out.println(" CODIGITO " + txt_Codigo.getText().trim());
        return regla.eliminar(txt_Codigo.getText().trim(), usuario.getId_usuario());
    }

    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            setVisible(false);
        }

        if (e.getKeyChar() == '\n') {
            if (e.getSource() == cb_Empresa) {
                if (cbLocali.isEnabled()) {
                    cbLocali.requestFocus();
                }
            }

            if (e.getSource() == cbLocali) {
                if (cb_PuntoVenta.isEnabled()) {
                    cb_PuntoVenta.requestFocus();
                }
            }

            /*if(e.getSource() == cb_PuntoVenta)*/
        }
    }

    public boolean loadRegister() {
        rn_TrabajadorPuntoVenta regla = new rn_TrabajadorPuntoVenta(path);

        Vector<Trabajador> reg = regla.listar("", "", "", "", "", new Date(1, 1, 1), "", "", "", "", "", "", rowSelection.getSelectedValue(1).toString());

        if (reg.isEmpty()) {
            return false;
        } else {
            Trabajador trabajador = reg.get(0);

            txt_Codigo.setText(mode == CLONE ? "" : trabajador.getId_trabajador_puntoventa());
            id_trabajador = trabajador.getId_trabajador().trim();
            id_puntoventa = trabajador.getId_puntoventa();
            txt_CodigoTrabajador.setText(trabajador.getId_trabajador().trim());
            txt_Nombre.setText(trabajador.getNombre());
            cargarEmpresa(trabajador.getId_empresa());
            cargarLocalidad(trabajador.getId_localidad());
            cargarPuntoVenta(trabajador.getId_puntoventa());
            chkHabilitar.setSelected((trabajador.getHabilitar().equals("S") ? true : false));
        }

        return true;
    }

    public void cargarEmpresa(String codEmpresa) {
        if (xempresa != null && !codEmpresa.equals("")) {
            for (int i = 0; i < xempresa.size(); i++) {
                if (xempresa.get(i).getId_empresa().equals(codEmpresa)) {
                    cb_Empresa.setSelectedIndex(i + 1);
                    break;
                }
            }
        }
    }

    public void cargarPuntoVenta(String codPuntoVenta) {
        if (xpuntoventa != null && !codPuntoVenta.equals("")) {
            for (int i = 0; i < xpuntoventa.size(); i++) {
                if (xpuntoventa.get(i).getId_punto_venta().toString().trim().equals(codPuntoVenta.trim())) {
                    cb_PuntoVenta.setSelectedIndex(i + 1);
                    break;
                }
            }
        }
    }

    public void cargarLocalidad(String codLocalidad) {
        if (xlocali != null && !codLocalidad.equals("")) {
            for (int i = 0; i < xlocali.size(); i++) {
                if (xlocali.get(i).getId_localidad().equals(codLocalidad)) {
                    cbLocali.setSelectedIndex(i + 1);
                    break;
                }
            }
        }
    }

    public void setRegisterEnabled(boolean e) {
        cb_Empresa.setEnabled(e);
        cbBuscarTrabajador.setEnabled(e);
    }

    public void focusGained(FocusEvent e) {
    }

    public void setRegisterEditable(boolean e) {
    }

    public void itemStateChanged(ItemEvent e) {
    }

    public void keyTyped(KeyEvent e) {
    }

    public void keyReleased(KeyEvent e) {
    }

    public boolean executeDetail() {
        return true;
    }

    public void showMessageSuccessfulInsert() {
    }

    public void showMessageSuccessfulUpdate() {
    }

    public void showMessageSuccessfulDelete() {
        return;
    }

    public void showMessageErrorInsert() {
    }

    public void showMessageErrorUpdate() {
    }

    public void showMessageErrorDelete() {
        return;
    }

    public boolean showConfirmDelete() {
        return true;
    }

    public boolean executeSelect() {
        return true;
    }

    public void addRow(String[] row) {
    }

    public void addRow(Usuario reg) {
    }

    public void setParametersRegister(ArrayList data, String[] columnNames) {
    }

    public void loadInicio() {
    }

    public void showSearchDialog() {
    }

    public void loadInicioUDD() {
    }

    public void loadInicioInsert() {
    }

    public void addRow(Object ob, int index) {
    }

    public void addRow(Object ob, int index, int cantidad) {
    }

    public void addRow(Object ob, int index, int cantidad, double participacion) {
    }

    public void removeRow(Object ob, int opcion) {
    }

    public void addRow(Object ob, int cantidad, double participacion) {
    }

    public void addDataRow(Object ob, int cantidad, double participacion) {
    }

    public void updateRow(Object ob, int opcion) {
    }

    public void addRow(Object ob) {
    }

    public void loadInicioUpdate() {
    }

    public ArrayList getDataTable() {
        return null;
    }

    public void loadInicioBeforeDetail() {
    }

    public void loadInicioAfterDetail() {
    }

    public void loadInicioDelete() {
    }

    public void addRow(Object ob, Component comp) {
    }

    public void addRow(Usuario reg, int opcion) {
    }

    public void addRow(Object reg[], String opcion) {
    }

    public void removeRow(Object reg[], String opcion) {
    }

    public void updateRow(Object reg[], String opcion) {
    }

    public void addRow(Object ob, String opcion) {
    }

    public void removeRow(Object ob, String opcion) {
    }

    public void updateRow(Object ob, String opcion) {
    }

    public void addRow(Usuario ob, Component comp, int modo) {
    }

    public void removeRow(Object ob, Component comp, int modo) {
    }

    public void updateRow(Usuario ob, Component comp, int modo) {
    }

    public void showMessagePrint(String codigo) {
    }

    public void focusLost(FocusEvent e) {
    }

    public boolean executeAnular() {
        return true;
    }

    public void addRow(Object[] ob, Component comp, int modo) {
    }

    public void updateRow(Object[] ob, Component comp, int modo) {
    }

    public void prepareRegister() {
    }

    @Override
    public boolean loadRegister(Object o) {
        return true;
    }
}
