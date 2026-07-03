/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uiregistervehiculo;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanAnexo;
import com.softcommerce.beans.BeanVehiculo;
import com.softcommerce.beans.BeanMarcaVehiculo;
import com.softcommerce.beans.BeanModeloVehiculo;
import com.softcommerce.beans.Usuario;
import com.softcommerce.conta.formularios.FormBuscarAnexo;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.general.controles.IntegerDocument;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.reglasnegocio.RnVehiculo;
import com.softcommerce.reglasnegocio.RnMarcaVehiculo;
import com.softcommerce.reglasnegocio.RnModeloVehiculo;
import com.softcommerce.reglasnegocio.RnAnexo;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import java.awt.Insets;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.MouseEvent;
import java.awt.event.MouseListener;
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import javax.swing.BorderFactory;
import javax.swing.JCheckBox;
import javax.swing.JComboBox;
import javax.swing.JFrame;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.border.Border;
import javax.swing.border.LineBorder;
import javax.swing.border.TitledBorder;

/**
 *
 * @author Team Develtrex
 */
public class UiRegisterVehiculo extends JHDialog implements InterUiRegisterVehiculo, ActionListener, ItemListener, KeyListener, FocusListener, MouseListener {

    private Usuario usuario;
    private JTextField txtCodigo;
    private JTextField txtPlaca;
    private JTextField txtConstacia;
    private JTextField txtPeso;
    private JTextField txtTransportista;
    private JTextField txtTransportistaDesc;
    private JComboBox cboMarca;
    private List<BeanMarcaVehiculo> xMarcaVehiculo;
    private JComboBox cboModelo;
    private List<BeanModeloVehiculo> xModeloVehiculo;
    private BeanVehiculo beanVehiculo;
    private JCheckBox chkEstado;
    private JFrame frame;

    public UiRegisterVehiculo(JFrame arg0, Usuario usuario, BeanVehiculo wVehiculo) {
        super(arg0, true);
        this.usuario = usuario;
        this.beanVehiculo = wVehiculo;
        this.frame = arg0;
        inicialize();
        initListener();
    }

    private void inicialize() {
        JPanel pnl_dialog = new JPanel();
        pnl_dialog.setLayout(new BorderLayout());
        pnl_dialog.setBackground(new Color(245, 245, 245));
        Border border = BorderFactory.createTitledBorder(null, "Datos de Vehiculo", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);
        JPanel pnlPromocion = new JPanel();
        pnlPromocion.setLayout(new GridBagLayout());
        pnlPromocion.setBackground(new Color(245, 245, 245));
        pnlPromocion.setBorder(border);
        GridBagConstraints gbc = new GridBagConstraints();
        gbc.gridx = 0;
        gbc.gridy = 0;
        gbc.insets = new Insets(2, 2, 2, 2);
        gbc.anchor = GridBagConstraints.WEST;

        JLabel lbl_Codigo = new JLabel("Código");
        pnlPromocion.add(lbl_Codigo, gbc);

        txtCodigo = new JTextField();
        txtCodigo.setEditable(false);
        gbc.gridx = 1;
        txtCodigo.setColumns(5);
        pnlPromocion.add(txtCodigo, gbc);

        JLabel lbl_Abrev = new JLabel("Marca");
        gbc.gridx = 0;
        gbc.gridy = 1;
        pnlPromocion.add(lbl_Abrev, gbc);

        cboMarca = new JComboBox();
        gbc.gridx = 1;
        gbc.gridwidth = 2;
        pnlPromocion.add(cboMarca, gbc);
        gbc.gridwidth = 1;

        JLabel lbl_Modelo = new JLabel("Modelo");
        gbc.gridx = 0;
        gbc.gridy = 2;
        pnlPromocion.add(lbl_Modelo, gbc);

        cboModelo = new JComboBox();
        gbc.gridx = 1;
        gbc.gridwidth = 2;
        pnlPromocion.add(cboModelo, gbc);
        gbc.gridwidth = 1;

        JLabel lblVendedor = new JLabel("Propietario");
        gbc.gridx = 0;
        gbc.gridy = 3;
        pnlPromocion.add(lblVendedor, gbc);

        gbc.gridx = 1;
        txtTransportista = new JTextField();
        txtTransportista.setDocument(new IntegerDocument(11));
        txtTransportista.setColumns(7);
        gbc.insets = new Insets(2, 1, 2, 0);
        pnlPromocion.add(txtTransportista, gbc);

        txtTransportistaDesc = new JTextField();
        txtTransportistaDesc.setEnabled(false);
        gbc.insets = new Insets(2, 0, 2, 0);
        gbc.gridx = 2;
        txtTransportistaDesc.setColumns(25);
        pnlPromocion.add(txtTransportistaDesc, gbc);

        JLabel lbl_Descripcion = new JLabel("Placa");
        gbc.gridx = 0;
        gbc.gridy = 4;
        pnlPromocion.add(lbl_Descripcion, gbc);

        txtPlaca = new JTextField();
        gbc.gridx = 1;
        gbc.gridwidth = 2;
        txtPlaca.setDocument(new UpperCaseNumberDocument(30));
        txtPlaca.setColumns(15);
        pnlPromocion.add(txtPlaca, gbc);
        gbc.gridwidth = 1;

        JLabel lbl_Constancia = new JLabel("Const inscripcion");
        gbc.gridx = 0;
        gbc.gridy = 5;
        pnlPromocion.add(lbl_Constancia, gbc);

        txtConstacia = new JTextField();
        gbc.gridx = 1;
        gbc.gridwidth = 2;
        txtConstacia.setDocument(new UpperCaseNumberDocument(30));
        txtConstacia.setColumns(15);
        pnlPromocion.add(txtConstacia, gbc);
        gbc.gridwidth = 1;

        JLabel lbl_Peso = new JLabel("Peso(KG)");
        gbc.gridx = 0;
        gbc.gridy = 6;
        pnlPromocion.add(lbl_Peso, gbc);

        txtPeso = new JTextField();
        gbc.gridx = 1;
        txtPeso.setDocument(new IntegerDocument(10));
        txtPeso.setColumns(7);
        txtPeso.setText("0");
        pnlPromocion.add(txtPeso, gbc);

        gbc.insets = new Insets(2, 2, 2, 2);

        chkEstado = new JCheckBox("Activo");
        gbc.gridx = 1;
        gbc.gridy = 7;
        pnlPromocion.add(chkEstado, gbc);

        pnl_dialog.add(pnlPromocion, BorderLayout.CENTER);

        setTitleName("Vehiculo");
        getContentPane().add(pnl_dialog);
        setMinimumSize(new Dimension(600, 250));
        this.pack();
        ComponentToolKit.centerComponentPosicion(this);
    }

    private void initListener() {
        txtPlaca.addKeyListener(this);
        txtPlaca.addFocusListener(this);
        txtConstacia.addKeyListener(this);
        txtConstacia.addFocusListener(this);
        txtPeso.addKeyListener(this);
        txtPeso.addFocusListener(this);
        txtTransportista.addKeyListener(this);
        txtTransportista.addMouseListener(this);
        txtTransportista.addFocusListener(this);
    }

    private void cargarMarca(String id_marca) {
        for (int i = 0; i < xMarcaVehiculo.size(); i++) {
            if (xMarcaVehiculo.get(i).getId_marca().equals(id_marca)) {
                cboMarca.setSelectedIndex(i + 1);
                break;
            }
        }
    }

    private void cargarModelo(String id_modelo) {
        for (int i = 0; i < xModeloVehiculo.size(); i++) {
            if (xModeloVehiculo.get(i).getId_modelo().equals(id_modelo)) {
                cboModelo.setSelectedIndex(i + 1);
                break;
            }
        }
    }

    private void loadMarca() throws Exception {
        try {
            if (xMarcaVehiculo == null) {
                xMarcaVehiculo = new ArrayList<BeanMarcaVehiculo>();
            } else {
                xMarcaVehiculo.clear();
            }
            RnMarcaVehiculo logic = new RnMarcaVehiculo(path);
            xMarcaVehiculo.addAll(logic.listarMarcaVehiculo("", "A"));
            cboMarca.removeAllItems();
            cboMarca.addItem("-- SELECCIONE --");
            for (int i = 0; i < xMarcaVehiculo.size(); i++) {
                cboMarca.addItem(xMarcaVehiculo.get(i).getDescripcion());
            }
            cboMarca.setSelectedIndex(0);
        } catch (Exception e) {
            throw e;
        }
    }

    private void loadModelo() throws Exception {
        try {
            if (xModeloVehiculo == null) {
                xModeloVehiculo = new ArrayList<BeanModeloVehiculo>();
            } else {
                xModeloVehiculo.clear();
            }
            RnModeloVehiculo logic = new RnModeloVehiculo(path);
            xModeloVehiculo.addAll(logic.listarModeloVehiculo("", "A"));
            cboModelo.removeAllItems();
            cboModelo.addItem("-- SELECCIONE --");
            for (int i = 0; i < xModeloVehiculo.size(); i++) {
                cboModelo.addItem(xModeloVehiculo.get(i).getDescripcion());
            }
            cboModelo.setSelectedIndex(0);
        } catch (Exception e) {
            throw e;
        }
    }

    private void buscarTransportista(JTextField txtAnexo, JTextField txtAnexoDesc) {
        try {
            String id_anexo = "";
            RnAnexo logicAnexo = new RnAnexo(path);
            if (txtAnexo.getText().trim().length() > 0) {
                BeanAnexo beanAnexo = new BeanAnexo();
                if (txtAnexo.getText().trim().length() < 10 && txtAnexo.getText().trim().length() != 8) {
                    String id_anexoAnt = "0000000000" + txtAnexo.getText().trim();
                    id_anexo = id_anexoAnt.substring(id_anexoAnt.length() - 10, id_anexoAnt.length());
                } else {
                    id_anexo = txtAnexo.getText();
                }
                beanAnexo = logicAnexo.beanAnexoImp("6", "", "A", id_anexo.trim(), "");
                if (beanAnexo != null) {
                    txtAnexoDesc.setText(beanAnexo.getDescripcion());
                    txtAnexo.setText(beanAnexo.getIdAnexo());
                    return;
                }
            }
            FormBuscarAnexo objBuscarAnexo = new FormBuscarAnexo(frame, this, path, txtAnexo, usuario, "6");
            objBuscarAnexo.setVisible(true);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    @Override
    public boolean isRegisterValid() {
        JTextField txt = new JTextField();
        txtPlaca.setBorder(txt.getBorder());
        txtConstacia.setBorder(txt.getBorder());
        txtPeso.setBorder(txt.getBorder());
        cboMarca.setBorder(txt.getBorder());
        cboModelo.setBorder(txt.getBorder());
        if (txtPlaca.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + ", debes especificar su Placa.", "Datos incompletos", JOptionPane.CANCEL_OPTION);
            txtPlaca.setBorder(new LineBorder(Color.RED));
            txtPlaca.requestFocus();
            return false;
        }
        if (txtConstacia.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + ", debes especificar su Constacia.", "Datos incompletos", JOptionPane.CANCEL_OPTION);
            txtConstacia.setBorder(new LineBorder(Color.RED));
            txtConstacia.requestFocus();
            return false;
        }
        if (txtPeso.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + ", debes especificar su Peso.", "Datos incompletos", JOptionPane.CANCEL_OPTION);
            txtPeso.setBorder(new LineBorder(Color.RED));
            txtPeso.requestFocus();
            return false;
        }
        if (cboMarca.getSelectedIndex() <= 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + ", debes Seleccionar Marca.", "Datos incompletos", JOptionPane.CANCEL_OPTION);
            cboMarca.setBorder(new LineBorder(Color.RED));
            cboMarca.requestFocus();
            return false;
        }
        if (cboModelo.getSelectedIndex() <= 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + ", debes Seleccionar Modelo.", "Datos incompletos", JOptionPane.CANCEL_OPTION);
            cboModelo.setBorder(new LineBorder(Color.RED));
            cboModelo.requestFocus();
            return false;
        }

        return true;
    }

    @Override
    public void showMessagePrint(String codigo) {
    }

    @Override
    public void setRegisterEnabled(boolean flag) {
    }

    @Override
    public void setRegisterEditable(boolean flag) {
        txtConstacia.setEditable(flag);
        txtPeso.setEditable(flag);
        txtPlaca.setEditable(flag);
        txtTransportista.setEditable(flag);
        cboMarca.setEnabled(flag);
        cboModelo.setEnabled(flag);
    }

    @Override
    public void loadCombo() {
        try {
            loadMarca();
            loadModelo();
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }

    @Override
    public void newRegister() {
        txtConstacia.requestFocus();
        txtPlaca.requestFocus();
        chkEstado.setSelected(true);
        chkEstado.setEnabled(false);
    }

    @Override
    public boolean loadRegister() {
        try {
            if (beanVehiculo != null) {
                txtCodigo.setText(beanVehiculo.getId_vehiculo());
                txtPlaca.setText(beanVehiculo.getPlaca());
                txtConstacia.setText(beanVehiculo.getConstanciainscripcion());
                txtPeso.setText(beanVehiculo.getPeso().toString());
                cargarMarca(beanVehiculo.getBeanMarcaVehiculo().getId_marca());
                cargarModelo(beanVehiculo.getBeanModeloVehiculo().getId_modelo());
                chkEstado.setSelected(beanVehiculo.getEstado().equals("A"));
                txtTransportista.setText(beanVehiculo.getId_anexo_empresa_transportista());
                txtTransportistaDesc.setText(beanVehiculo.getEmpresa());
            }
            return true;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Sistema", JOptionPane.OK_OPTION);
            return false;
        }
    }

    @Override
    public boolean loadRegister(Object o) {
        return true;
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
        if (comp == txtTransportista) {
            txtTransportista.setText(((BeanAnexo) valor).getIdAnexo().trim());
            txtTransportistaDesc.setText(((BeanAnexo) valor).getDescripcion());
        }
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
    public void showMessageErrorDelete() {
    }

    @Override
    public void showMessageErrorUpdate() {
    }

    @Override
    public void showMessageErrorInsert() {
    }

    @Override
    public String executeInsert() {
        try {
            RnVehiculo logic = new RnVehiculo(path);
            BeanVehiculo bean = new BeanVehiculo();
            BeanMarcaVehiculo beanMarcaVehiculo = new BeanMarcaVehiculo();
            BeanModeloVehiculo beanModeloVehiculo = new BeanModeloVehiculo();
            bean.setId_vehiculo(txtCodigo.getText());
            bean.setPlaca(txtPlaca.getText().trim());
            bean.setConstanciainscripcion(txtConstacia.getText().trim());
            bean.setPeso(new BigDecimal(txtPeso.getText()));
            bean.setId_anexo_empresa_transportista(txtTransportista.getText().trim());
            bean.setEstado(chkEstado.isSelected() ? "A" : "D");
            beanMarcaVehiculo.setId_marca(cboMarca.getSelectedIndex() > 0 ? xMarcaVehiculo.get(cboMarca.getSelectedIndex() - 1).getId_marca() : "");
            beanModeloVehiculo.setId_modelo(cboModelo.getSelectedIndex() > 0 ? xModeloVehiculo.get(cboModelo.getSelectedIndex() - 1).getId_modelo() : "");
            bean.setBeanMarcaVehiculo(beanMarcaVehiculo);
            bean.setBeanModeloVehiculo(beanModeloVehiculo);
            bean.setId_usuario(usuario.getId_usuario());
            return logic.mantVehiculo(bean, "I");
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Sistema", JOptionPane.OK_OPTION);
            return "";
        }
    }

    @Override
    public String executeUpdate() {
        try {
            RnVehiculo logic = new RnVehiculo(path);
            BeanVehiculo bean = new BeanVehiculo();
            BeanMarcaVehiculo beanMarcaVehiculo = new BeanMarcaVehiculo();
            BeanModeloVehiculo beanModeloVehiculo = new BeanModeloVehiculo();
            bean.setId_vehiculo(txtCodigo.getText());
            bean.setPlaca(txtPlaca.getText().trim());
            bean.setConstanciainscripcion(txtConstacia.getText().trim());
            bean.setPeso(new BigDecimal(txtPeso.getText()));
            bean.setId_anexo_empresa_transportista(txtTransportista.getText().trim());
            bean.setEstado(chkEstado.isSelected() ? "A" : "D");
            beanMarcaVehiculo.setId_marca(cboMarca.getSelectedIndex() > 0 ? xMarcaVehiculo.get(cboMarca.getSelectedIndex() - 1).getId_marca() : "");
            beanModeloVehiculo.setId_modelo(cboModelo.getSelectedIndex() > 0 ? xModeloVehiculo.get(cboModelo.getSelectedIndex() - 1).getId_modelo() : "");
            bean.setBeanMarcaVehiculo(beanMarcaVehiculo);
            bean.setBeanModeloVehiculo(beanModeloVehiculo);
            bean.setId_usuario(usuario.getId_usuario());
            return logic.mantVehiculo(bean, "A");
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Sistema", JOptionPane.OK_OPTION);
            return "";
        }
    }

    @Override
    public boolean executeDelete() {
        try {
            RnVehiculo logic = new RnVehiculo(path);
            BeanVehiculo bean = new BeanVehiculo();
            BeanMarcaVehiculo beanMarcaVehiculo = new BeanMarcaVehiculo();
            BeanModeloVehiculo beanModeloVehiculo = new BeanModeloVehiculo();
            bean.setId_vehiculo(txtCodigo.getText());
            bean.setPlaca(txtPlaca.getText().trim());
            bean.setConstanciainscripcion(txtConstacia.getText().trim());
            bean.setPeso(new BigDecimal(txtPeso.getText()));
            bean.setId_anexo_empresa_transportista(txtTransportista.getText().trim());
            bean.setEstado(chkEstado.isSelected() ? "A" : "D");
            beanMarcaVehiculo.setId_marca(cboMarca.getSelectedIndex() > 0 ? xMarcaVehiculo.get(cboMarca.getSelectedIndex() - 1).getId_marca() : "");
            beanModeloVehiculo.setId_modelo(cboModelo.getSelectedIndex() > 0 ? xModeloVehiculo.get(cboModelo.getSelectedIndex() - 1).getId_modelo() : "");
            bean.setBeanMarcaVehiculo(beanMarcaVehiculo);
            bean.setBeanModeloVehiculo(beanModeloVehiculo);
            bean.setId_usuario(usuario.getId_usuario());
            String rpta = logic.mantVehiculo(bean, "E");
            return true;
        } catch (Exception e) {
            e.printStackTrace();
            JOptionPane.showMessageDialog(this, "Error: " + e.getMessage(), "Sistema", JOptionPane.OK_OPTION);
            return false;
        }
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
    public void actionPerformed(ActionEvent e) {
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
    }

    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            dispose();
        }
        if (e.getKeyChar() == '\n') {
            if (e.getSource() == txtPlaca) {
                setFocusAndClick();
            }
            if (e.getSource() == txtCodigo) {
                setFocusAndClick();
            }
            if (e.getSource() == txtTransportista) {
                buscarTransportista(txtTransportista, txtTransportistaDesc);
            }
        }
        if (e.getKeyChar() == KeyEvent.VK_DELETE || e.getKeyChar() == KeyEvent.VK_BACK_SPACE) {
            if (e.getSource() == txtTransportista) {
                txtTransportistaDesc.setText("");
            }
        }
    }

    @Override
    public void keyReleased(KeyEvent e) {
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (txtPlaca == e.getSource()) {
            txtPlaca.selectAll();
        }
        if (txtConstacia == e.getSource()) {
            txtConstacia.selectAll();
        }
        if (txtPeso == e.getSource()) {
            txtPeso.selectAll();
        }
        if (txtTransportista == e.getSource()) {
            txtTransportista.selectAll();
        }
    }

    @Override
    public void focusLost(FocusEvent e) {
    }

    @Override
    public void mouseClicked(MouseEvent e) {
        if (e.getClickCount() == 2) {
            if (e.getSource() == txtTransportista) {
                buscarTransportista(txtTransportista, txtTransportistaDesc);
            }
        }
    }

    @Override
    public void mousePressed(MouseEvent e) {
    }

    @Override
    public void mouseReleased(MouseEvent e) {
    }

    @Override
    public void mouseEntered(MouseEvent e) {
    }

    @Override
    public void mouseExited(MouseEvent e) {
    }
}
