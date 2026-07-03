package com.softcommerce.formularios;

import com.softcommerce.beans.Empresa;
import com.softcommerce.beans.Ubigeo;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.LowerCaseNumerDocument;
import com.softcommerce.general.controles.UpperCaseDocument;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.reglasnegocio.RnEmpresa;
import com.softcommerce.reglasnegocio.RnUbigeo;
import com.softcommerce.util.LayoutUtil;
import java.awt.BorderLayout;
import java.awt.Component;
import java.awt.event.FocusEvent;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.Color;
import java.awt.Font;
import java.awt.Dimension;
import java.awt.Dialog;
import java.awt.Frame;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.event.FocusListener;
import java.util.ArrayList;
import java.util.List;
import javax.swing.JCheckBox;
import javax.swing.JOptionPane;
import javax.swing.JTextField;
import javax.swing.border.LineBorder;
import javax.swing.JPanel;
import javax.swing.BorderFactory;
import javax.swing.JComboBox;
import javax.swing.border.Border;
import javax.swing.border.TitledBorder;

public class RegisterEmpresa
        extends JHDialog implements ActionListener, KeyListener, FocusListener {

    private JTextField txtCodigo;
    private JTextField txtNombre;
    private JTextField txtDireccion;
    private JTextField txtRuc;
    private JTextField txtRepresentante;
    private JTextField txtTelefono;
    private JTextField txtWebsite;
    private JTextField txtDireccionComercial;
    private JTextField txtCorreo;
    private JCheckBox chkAgentePercepcion;
    private JComboBox cboDepartamento;
    private List<Ubigeo> xDepartamento;
    private JComboBox cboProvincia;
    private List<Ubigeo> xProvincia;
    private JComboBox cboDistrito;
    private List<Ubigeo> xDistrito;

    private Usuario usuario;

    public RegisterEmpresa(Frame arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    public RegisterEmpresa(Dialog arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    private void inicialize() {
        JPanel pnl_dialog = new JPanel();
        pnl_dialog.setLayout(new BorderLayout());
        pnl_dialog.setBackground(new Color(245, 245, 245));
        pnl_dialog.add(this.getPnlEmpresa(), BorderLayout.CENTER);
        this.initListener();
        setTitleName("Empresa");
        getContentPane().add(pnl_dialog);
        setSize(new Dimension(435, 485));
        this.pack();
        ComponentToolKit.centerComponentPosicion(this);
    }

    private JPanel getPnlEmpresa() {
        JPanel pnlPrinc = new JPanel();
        Border border = BorderFactory.createTitledBorder(null, "Datos de Empresa", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Verdana", 1, 11), Color.BLACK);
        pnlPrinc.setBorder(border);
        pnlPrinc.setLayout(new BorderLayout());
        JPanel pnl = new JPanel();
        pnl.setLayout(new GridBagLayout());
        GridBagConstraints gbc = LayoutUtil.getGbc();
        pnlPrinc.add(pnl, BorderLayout.WEST);

        CLabel lblCodigo = new CLabel("Código");
        pnl.add(lblCodigo, gbc);

        gbc.gridx = 1;
        txtCodigo = new JTextField();
        txtCodigo.setEditable(false);
        txtCodigo.setColumns(3);
        pnl.add(txtCodigo, gbc);

        gbc.gridx = 0;
        gbc.gridy = 1;
        CLabel lblNombre = new CLabel("Nombre");
        pnl.add(lblNombre, gbc);

        gbc.gridx = 1;
        txtNombre = new JTextField();
        txtNombre.setDocument(new UpperCaseNumberDocument(180));
        txtNombre.setColumns(25);
        pnl.add(txtNombre, gbc);

        gbc.gridx = 0;
        gbc.gridy = 2;
        CLabel lblDireccion = new CLabel("Dirección");
        pnl.add(lblDireccion, gbc);

        gbc.gridx = 1;
        txtDireccion = new JTextField();
        txtDireccion.setDocument(new UpperCaseNumberDocument(180));
        txtDireccion.setColumns(25);
        pnl.add(txtDireccion, gbc);

        gbc.gridx = 0;
        gbc.gridy = 3;
        CLabel lblRuc = new CLabel("RUC");
        pnl.add(lblRuc, gbc);

        gbc.gridx = 1;
        txtRuc = new JTextField();
        txtRuc.setDocument(new IntegerDocument(11));
        txtRuc.setColumns(10);
        pnl.add(txtRuc, gbc);

        gbc.gridx = 0;
        gbc.gridy = 4;
        CLabel lblRepresentante = new CLabel("Representante");
        pnl.add(lblRepresentante, gbc);

        gbc.gridx = 1;
        txtRepresentante = new JTextField();
        txtRepresentante.setDocument(new UpperCaseDocument(80));
        txtRepresentante.setColumns(25);
        pnl.add(txtRepresentante, gbc);

        gbc.gridx = 0;
        gbc.gridy = 5;
        CLabel lblTelefono = new CLabel("Teléfono");
        pnl.add(lblTelefono, gbc);

        gbc.gridx = 1;
        txtTelefono = new JTextField();        
        txtTelefono.setColumns(10);
        pnl.add(txtTelefono, gbc);

        gbc.gridx = 0;
        gbc.gridy = 6;
        CLabel lblWebsite = new CLabel("Website");
        pnl.add(lblWebsite, gbc);

        gbc.gridx = 1;
        txtWebsite = new JTextField();
        txtWebsite.setDocument(new LowerCaseNumerDocument(255));
        txtWebsite.setColumns(25);
        pnl.add(txtWebsite, gbc);

        gbc.gridx = 0;
        gbc.gridy = 7;
        CLabel lblDireccionComercial = new CLabel("Dirección Comercial");
        pnl.add(lblDireccionComercial, gbc);

        gbc.gridx = 1;
        txtDireccionComercial = new JTextField();
        txtDireccionComercial.setDocument(new UpperCaseNumberDocument(180));
        txtDireccionComercial.setColumns(25);
        pnl.add(txtDireccionComercial, gbc);

        gbc.gridx = 0;
        gbc.gridy = 8;
        CLabel lblCorreo = new CLabel("Correo");
        pnl.add(lblCorreo, gbc);

        gbc.gridx = 1;
        txtCorreo = new JTextField();
        txtCorreo.setDocument(new LowerCaseNumerDocument(200));
        txtCorreo.setColumns(25);
        pnl.add(txtCorreo, gbc);

        gbc.gridx = 0;
        gbc.gridy = 9;
        CLabel lblDepartamento = new CLabel("Departamento");
        pnl.add(lblDepartamento, gbc);

        gbc.gridx = 1;
        cboDepartamento = new JComboBox();
        pnl.add(cboDepartamento, gbc);

        gbc.gridx = 0;
        gbc.gridy = 10;
        CLabel lblProvincia = new CLabel("Provincia");
        pnl.add(lblProvincia, gbc);

        gbc.gridx = 1;
        cboProvincia = new JComboBox();
        cboProvincia.setEnabled(false);
        pnl.add(cboProvincia, gbc);

        gbc.gridx = 0;
        gbc.gridy = 11;
        CLabel lblDistrito = new CLabel("Distrito");
        pnl.add(lblDistrito, gbc);

        gbc.gridx = 1;
        cboDistrito = new JComboBox();
        cboDistrito.setEnabled(false);
        pnl.add(cboDistrito, gbc);

        gbc.gridx = 1;
        gbc.gridy = 12;
        chkAgentePercepcion = new JCheckBox("Agente de Percepcion");
        chkAgentePercepcion.setOpaque(false);
        chkAgentePercepcion.setHorizontalTextPosition(JCheckBox.LEFT);
        pnl.add(chkAgentePercepcion, gbc);
        return pnlPrinc;
    }

    private void initListener() {
        txtNombre.addKeyListener(this);
        txtNombre.addFocusListener(this);
        txtDireccion.addKeyListener(this);
        txtDireccion.addFocusListener(this);
        txtRuc.addKeyListener(this);
        txtRuc.addFocusListener(this);
        txtRepresentante.addKeyListener(this);
        txtRepresentante.addFocusListener(this);
        txtTelefono.addKeyListener(this);
        txtTelefono.addFocusListener(this);
        txtWebsite.addKeyListener(this);
        txtWebsite.addFocusListener(this);
        txtDireccionComercial.addKeyListener(this);
        txtDireccionComercial.addFocusListener(this);
        chkAgentePercepcion.addKeyListener(this);
        cboDepartamento.addActionListener(this);
        cboProvincia.addActionListener(this);
    }

    @Override
    public void loadCombo() {
        loadDepartamento();
    }

    public void loadDepartamento() {
        try {
            RnUbigeo regla_Ubigeo = new RnUbigeo(path);
            if (xDepartamento != null) {
                xDepartamento.clear();
            } else {
                xDepartamento = new ArrayList<Ubigeo>();
            }
            xDepartamento.addAll(regla_Ubigeo.listarGeneral());
            cboDepartamento.removeAllItems();
            cboDepartamento.addItem("--- Seleccione un Departamento ---");
            for (int i = 0; i < xDepartamento.size(); i++) {
                cboDepartamento.addItem(xDepartamento.get(i).getDescripcion());
            }
            cboDepartamento.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadDistrito(String xcoddis) {
        try {
            RnUbigeo regla_Ubigeo = new RnUbigeo(path);
            if (xDistrito != null) {
                xDistrito.clear();
            } else {
                xDistrito = new ArrayList<Ubigeo>();
            }
            xDistrito.addAll(regla_Ubigeo.listar(xcoddis, ""));
            cboDistrito.removeAllItems();
            cboDistrito.addItem("--- Seleccione una Distrito ---");
            for (int i = 0; i < xDistrito.size(); i++) {
                cboDistrito.addItem(xDistrito.get(i).getDescripcion());
            }
            cboDistrito.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    public void loadProvincia(String xcoddep) {
        try {
            RnUbigeo regla_Ubigeo = new RnUbigeo(path);
            if (xProvincia != null) {
                xProvincia.clear();
            } else {
                xProvincia = new ArrayList<Ubigeo>();
            }
            xProvincia.addAll(regla_Ubigeo.listar(xcoddep, ""));
            cboProvincia.removeAllItems();
            cboProvincia.addItem("--- Seleccione una Provincia ---");
            for (int i = 0; i < xProvincia.size(); i++) {
                cboProvincia.addItem(xProvincia.get(i).getDescripcion());
            }
            cboProvincia.setSelectedIndex(0);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    @Override
    public void newRegister() {
        JTextField txt = new JTextField();
        txtNombre.setBorder(txt.getBorder());
        txtDireccion.setBorder(txt.getBorder());
        txtRuc.setBorder(txt.getBorder());

        txtCodigo.setText("");
        txtNombre.setText("");
        txtDireccion.setText("");
        txtRuc.setText("");
        txtRepresentante.setText("");
        txtTelefono.setText("");
        txtWebsite.setText("");
        txtDireccionComercial.setText("");
        chkAgentePercepcion.setSelected(false);
        cboDepartamento.setSelectedIndex(0);
        txtNombre.requestFocus();
    }

    @Override
    public String executeInsert() {
        return "";
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() instanceof JTextField) {
            ((JTextField) e.getSource()).selectAll();
        }
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            dispose();
        }

        if (e.getKeyChar() == '\n') {
            if (e.getSource() == txtNombre) {
                txtDireccion.requestFocus();
            } else if (e.getSource() == txtDireccion) {
                txtRuc.requestFocus();
            } else if (e.getSource() == txtRuc) {
                txtRepresentante.requestFocus();
            } else if (e.getSource() == txtRepresentante) {
                txtTelefono.requestFocus();
            } else if (e.getSource() == txtTelefono) {
                txtWebsite.requestFocus();
            } else if (e.getSource() == txtWebsite) {
                txtDireccionComercial.requestFocus();
            } else if (e.getSource() == txtDireccionComercial) {
                chkAgentePercepcion.requestFocus();
            } else if (e.getSource() == chkAgentePercepcion) {
                setFocusAndClick();
            }
        }
    }

    @Override
    public boolean isRegisterValid() {
        JTextField txt = new JTextField();
        txtDireccion.setBorder(txt.getBorder());
        txtNombre.setBorder(txt.getBorder());
        txtRuc.setBorder(txt.getBorder());

        if (txtNombre.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " una Empresa, debes especificar su Nombre.", "Datos incompletos de Empresa", JOptionPane.CANCEL_OPTION);
            txtNombre.setBorder(new LineBorder(Color.RED));
            txtNombre.requestFocus();

            return false;
        }

        if (txtDireccion.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " una Empresa, debes especificar su Direccion.", "Datos incompletos de Empresa", JOptionPane.CANCEL_OPTION);
            txtDireccion.setBorder(new LineBorder(Color.RED));
            txtDireccion.requestFocus();

            return false;
        }

        if (txtRuc.getText().length() != 11) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " una Empresa, debes especificar su RUC.", "Datos incompletos de Empresa", JOptionPane.CANCEL_OPTION);
            txtRuc.setBorder(new LineBorder(Color.RED));
            txtRuc.requestFocus();

            return false;
        }

        return true;
    }

    @Override
    public boolean loadRegister() {
        try {
            RnEmpresa regla = new RnEmpresa(path);

            List<Empresa> reg = regla.listarEmpresa(rowSelection.getSelectedValue(1).toString());

            if (reg.isEmpty()) {
                return false;
            } else {
                Empresa e = reg.get(0);
                txtCodigo.setText(mode == CLONE ? "" : e.getId_empresa());
                txtNombre.setText(e.getNombre());
                txtDireccion.setText(e.getDireccion());
                txtRuc.setText(e.getRuc());
                txtRepresentante.setText(e.getRepresentante());
                txtTelefono.setText(e.getTelefono());
                txtWebsite.setText(e.getWebsite());
                txtDireccionComercial.setText(e.getDcomercial());
                txtCorreo.setText(e.getCorreo());
                this.setSelectedUbigeo(e.getIdUbigeo());
                chkAgentePercepcion.setSelected((!e.getFlag_percepcion().equals("N") && !reg.get(0).getFlag_percepcion().equals("")));
            }
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }

    private void setSelectedUbigeo(String idUbigeo) {
        if (idUbigeo.trim().isEmpty()) {
            return;
        }
        cboDepartamento.setSelectedIndex(this.getPosDepartamento(idUbigeo.substring(0, 2)));
        cboProvincia.setSelectedIndex(this.getPosProvincia(idUbigeo.substring(0, 4)));
        cboDistrito.setSelectedIndex(this.getPosDistrito(idUbigeo.trim()));
    }

    private int getPosDepartamento(String idDepartamento) {
        for (Ubigeo ubigeo : xDepartamento) {
            if (idDepartamento.trim().equals(ubigeo.getCodigo().trim())) {
                return xDepartamento.indexOf(ubigeo) + 1;
            }
        }
        return 0;
    }

    private int getPosProvincia(String idProvincia) {
        for (Ubigeo ubigeo : xProvincia) {
            if (idProvincia.trim().equals(ubigeo.getCodigo().trim())) {
                return xProvincia.indexOf(ubigeo) + 1;
            }
        }
        return -1;
    }

    private int getPosDistrito(String idDistrito) {
        for (Ubigeo ubigeo : xDistrito) {
            if (idDistrito.trim().equals(ubigeo.getCodigo().trim())) {
                return xDistrito.indexOf(ubigeo) + 1;
            }
        }
        return -1;
    }

    @Override
    public String executeUpdate() {
        try {
            RnEmpresa regla = new RnEmpresa(path);
            return regla.modificar(this.getEmpresa(), usuario.getId_usuario());
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, e.getMessage());
            return "";
        }
    }

    private Empresa getEmpresa() {
        Empresa empresa = new Empresa();
        empresa.setId_empresa(txtCodigo.getText().trim());
        empresa.setNombre(txtNombre.getText().trim());
        empresa.setDireccion(txtDireccion.getText().trim());
        empresa.setRuc(txtRuc.getText().trim());
        empresa.setRepresentante(txtRepresentante.getText().trim());
        empresa.setTelefono(txtTelefono.getText().trim());
        empresa.setWebsite(txtWebsite.getText().trim());
        empresa.setDcomercial(txtDireccionComercial.getText().trim());
        empresa.setCorreo(txtCorreo.getText().trim());
        empresa.setIdUbigeo(this.getIdUbigeo());
        empresa.setFlag_percepcion(chkAgentePercepcion.isSelected() ? "S" : "N");
        return empresa;
    }

    private String getIdUbigeo() {
        if (cboDistrito.getSelectedIndex() > 0) {
            return xDistrito.get(cboDistrito.getSelectedIndex() - 1).getCodigo();
        }
        return "";
    }

    @Override
    public boolean executeDelete() {
        return true;
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (cboDepartamento == e.getSource()) {
            if (cboDepartamento.getItemCount() > 0) {
                if (cboDepartamento.getSelectedIndex() == 0) {
                    cboDistrito.removeAllItems();
                    cboProvincia.removeAllItems();
                    cboProvincia.setEnabled(false);
                    cboDistrito.setEnabled(false);
                } else {
                    if (mode == UPDATE || mode == INSERT || mode == CLONE) {
                        cboProvincia.setEnabled(true);
                    }
                    loadProvincia(xDepartamento.get(cboDepartamento.getSelectedIndex() - 1).getCodigo());
                }
            }
        }
        if (cboProvincia == e.getSource()) {
            if (cboProvincia.getItemCount() > 0) {
                if (cboProvincia.getSelectedIndex() == 0) {
                    cboDistrito.removeAllItems();
                    cboDistrito.setEnabled(false);
                } else {
                    if (mode == UPDATE || mode == INSERT || mode == CLONE) {
                        cboDistrito.setEnabled(true);
                    }

                    loadDistrito(xProvincia.get(cboProvincia.getSelectedIndex() - 1).getCodigo());
                }
            }
        }
    }

    @Override
    public void setRegisterEnabled(boolean e) {
        chkAgentePercepcion.setEnabled(e);
        cboDepartamento.setEnabled(e);
        cboProvincia.setEnabled(e);
        cboDistrito.setEnabled(e);
    }

    @Override
    public void setRegisterEditable(boolean e) {
        txtNombre.setEditable(e);
        txtDireccion.setEditable(e);
        txtRuc.setEditable(e);
        txtRepresentante.setEditable(e);
        txtTelefono.setEditable(e);
        txtWebsite.setEditable(e);
        txtDireccionComercial.setEditable(e);
        txtCorreo.setEditable(e);
    }

    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void keyReleased(KeyEvent e) {
    }

    @Override
    public boolean executeSelect() {
        return true;
    }

    public boolean executeDetail() {
        return true;
    }

    @Override
    public void showMessageSuccessfulInsert() {
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
    public void showMessagePrint(String codigo) {
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
    }

    @Override
    public void focusLost(FocusEvent e) {
    }

    @Override
    public boolean executeAnular() {
        return true;
    }

    @Override
    public boolean loadRegister(Object o) {
        return true;
    }
}
