package com.softcommerce.views.uiregisterfamilia;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.BeanFamilia;
import com.softcommerce.beans.Usuario;
import com.softcommerce.entity.FamiliaSunat;
import com.softcommerce.enums.OperacionBDEnum;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.ComponentToolKit;
import java.awt.Component;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import java.awt.event.FocusEvent;
import javax.swing.JPanel;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;
import javax.swing.BorderFactory;
import java.awt.event.KeyListener;
import java.awt.Color;
import java.awt.Dialog;
import java.awt.Font;
import javax.swing.border.TitledBorder;
import java.awt.Dimension;
import java.awt.Frame;
import java.awt.event.FocusListener;
import java.util.ArrayList;
import java.util.List;
import javax.swing.JOptionPane;
import javax.swing.JTextField;
import javax.swing.border.Border;
import javax.swing.border.LineBorder;
import com.softcommerce.reglasnegocio.RnFamilia;
import com.softcommerce.util.ExceptionHandler;
import com.softcommerce.util.LayoutUtil;
import com.softcommerce.util.combo.LoadComboItem;
import java.awt.BorderLayout;
import java.awt.GridBagConstraints;
import java.awt.GridBagLayout;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import org.apache.log4j.Logger;

public class UiRegisterFamilia
        extends JHDialog
        implements InterUiRegisterFamilia, ActionListener, ItemListener, KeyListener, FocusListener {
    
    private JTextField txtCodigo;
    private JTextField txtDescripcion;
    private final Usuario usuario;
    private JComboBox cboSunat;
    private final Logger logger = Logger.getLogger(UiRegisterFamilia.class);
    
    public UiRegisterFamilia(Frame arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }
    
    public UiRegisterFamilia(Dialog arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }
    
    private void inicialize() {
        JPanel pnlDialog = new JPanel();
        pnlDialog.setLayout(new BorderLayout());
        pnlDialog.setBackground(new Color(245, 245, 245));
        pnlDialog.add(this.getPnlFamilia(), BorderLayout.CENTER);
        setTitleName("Familia");
        getContentPane().add(pnlDialog);
        setSize(new Dimension(750, 225));
        ComponentToolKit.centerComponentPosicion(this);
    }
    
    private JPanel getPnlFamilia() {
        JPanel pnlPrinc = new JPanel();
        pnlPrinc.setLayout(new BorderLayout());
        pnlPrinc.setBackground(new Color(245, 245, 245));
        
        Border border = BorderFactory.createTitledBorder(null, "Datos de Familia", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);
        JPanel pnlFamilia = new JPanel();
        pnlFamilia.setLayout(new GridBagLayout());
        pnlFamilia.setBackground(new Color(245, 245, 245));
        pnlFamilia.setBorder(border);
        pnlPrinc.add(pnlFamilia, BorderLayout.WEST);
        
        GridBagConstraints gbc = LayoutUtil.getGbc();
        
        CLabel lblCodigo = new CLabel("Código");
        pnlFamilia.add(lblCodigo, gbc);
        
        gbc.gridx = 1;
        txtCodigo = new JTextField();
        txtCodigo.setEditable(false);
        txtCodigo.setColumns(6);
        pnlFamilia.add(txtCodigo, gbc);
        
        gbc.gridx = 0;
        gbc.gridy = 1;
        CLabel lblDescripcion = new CLabel("Descripción");
        pnlFamilia.add(lblDescripcion, gbc);
        
        gbc.gridx = 1;
        txtDescripcion = new JTextField();
        txtDescripcion.setDocument(new UpperCaseNumberDocument(100));
        txtDescripcion.addKeyListener(this);
        txtDescripcion.addFocusListener(this);
        txtDescripcion.setColumns(25);
        pnlFamilia.add(txtDescripcion, gbc);
        
        gbc.gridx = 0;
        gbc.gridy = 2;
        JLabel lblSunat = new JLabel("Codigo Sunat");
        pnlFamilia.add(lblSunat, gbc);
        
        gbc.gridx = 1;
        cboSunat = new JComboBox();
        cboSunat.setMaximumSize(new Dimension(600, 25));
        pnlFamilia.add(cboSunat, gbc);
        return pnlPrinc;
    }
    
    @Override
    public void loadCombo() {
        try {
            LoadComboItem.loadComboFamiliaSunat(path, cboSunat);
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
        }
    }
    
    @Override
    public void newRegister() {
        JTextField txt = new JTextField();
        txtDescripcion.setBorder(txt.getBorder());
        
        txtCodigo.setText("");
        txtDescripcion.setText("");
        
        txtDescripcion.requestFocus();
    }
    
    private BeanFamilia getFamilia() {
        BeanFamilia familia = new BeanFamilia();
        familia.setIdFamilia(txtCodigo.getText().trim());
        familia.setDescripcion(txtDescripcion.getText().trim());
        familia.setFamiliaSunat(new FamiliaSunat(LoadComboItem.getIdComboNull(cboSunat)));
        return familia;
    }
    
    @Override
    public String executeInsert() {
        try {
            RnFamilia regla = new RnFamilia(path);
            return regla.mantFamilia(this.getFamilia(), usuario.getCodempresa(), OperacionBDEnum.INSERTAR);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return "";
        }
    }
    
    @Override
    public void focusGained(FocusEvent e) {
        if (txtDescripcion == e.getSource()) {
            txtDescripcion.selectAll();
        }
    }
    
    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            dispose();
        }
        
        if (e.getKeyChar() == '\n') {
            if (e.getSource() == txtDescripcion) {
                setFocusAndClick();
            }
        }
    }
    
    @Override
    public boolean isRegisterValid() {
        JTextField txt = new JTextField();
        txtDescripcion.setBorder(txt.getBorder());
        
        if (txtDescripcion.getText().trim().length() == 0) {
            JOptionPane.showMessageDialog(this, "Para " + namemode + " una Familia, debes especificar su Descripcion.", "Datos incompletos de Familia", JOptionPane.CANCEL_OPTION);
            txtDescripcion.setBorder(new LineBorder(Color.RED));
            txtDescripcion.requestFocus();
            
            return false;
        }
        
        return true;
    }
    
    @Override
    public boolean loadRegister() {
        try {
            RnFamilia regla = new RnFamilia(path);
            List<BeanFamilia> lista = regla.listar(rowSelection.getSelectedValue(1).toString(), "", usuario.getCodempresa());
            if (lista.isEmpty()) {
                return false;
            }
            BeanFamilia beanFamilia = lista.get(0);
            txtCodigo.setText(mode == CLONE ? "" : beanFamilia.getIdFamilia());
            txtDescripcion.setText(beanFamilia.getDescripcion());
            LoadComboItem.setComboItem(beanFamilia.getCodigoFamiliaSunat(), cboSunat);
            return true;
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }
    
    @Override
    public String executeUpdate() {
        try {
            RnFamilia regla = new RnFamilia(path);
            return regla.mantFamilia(this.getFamilia(), usuario.getCodempresa(), OperacionBDEnum.ACTUALIZAR);
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return "";
        }
    }
    
    @Override
    public boolean executeDelete() {
        try {
            RnFamilia regla = new RnFamilia(path);
            regla.mantFamilia(this.getFamilia(), usuario.getCodempresa(), OperacionBDEnum.ELIMINAR);
            return true;
        } catch (Exception e) {
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }
    
    @Override
    public void actionPerformed(ActionEvent e) {
    }
    
    @Override
    public void setRegisterEnabled(boolean e) {
    }
    
    @Override
    public void setRegisterEditable(boolean e) {
        txtDescripcion.setEditable(e);
    }
    
    @Override
    public void focusLost(FocusEvent e) {
    }
    
    public void prepareRegister() {
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
    
    public boolean showConfirmDelete() {
        return true;
    }
    
    @Override
    public boolean executeSelect() {
        return true;
    }
    
    public void addRow(String[] row) {
    }
    
    @Override
    public void showMessagePrint(String codigo) {
    }
    
    @Override
    public void itemStateChanged(ItemEvent e) {
    }
    
    @Override
    public void keyTyped(KeyEvent e) {
    }
    
    @Override
    public void keyReleased(KeyEvent e) {
    }
    
    public void addRow(Object[] reg) {
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
    
    public void loadInicioBeforeDetail() {
    }
    
    public void loadInicioAfterDetail() {
    }
    
    public void loadInicioDelete() {
    }
    
    public void addRow(Object ob, Component comp) {
    }
    
    @Override
    public void setValueSearch(Object valor, Component comp) {
    }
    
    public void addRow(Object[] reg, int opcion) {
    }
    
    public ArrayList getDataTable() {
        return null;
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
    
    public void removeRow(Object ob, Component comp, int modo) {
    }
    
    public void updateRow(Object[] ob, Component comp, int modo) {
    }
    
    public void addRow(Object[] ob, Component comp, int modo) {
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
