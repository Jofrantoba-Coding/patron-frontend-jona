package com.softcommerce.formularios;

import com.softcommerce.beans.BeanLaboratorioClinico;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.ComponentToolKit;
import java.awt.Component;
import com.softcommerce.general.controles.JHDialog;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import java.awt.event.FocusEvent;
import javax.swing.JPanel;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
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
import java.util.List;
import javax.swing.JOptionPane;
import javax.swing.JTextField;
import javax.swing.border.Border;
import javax.swing.border.LineBorder;
import com.softcommerce.reglasnegocio.RnLaboratorioClinico;
import com.softcommerce.util.ExceptionHandler;
import java.sql.SQLException;
import org.apache.log4j.Logger;

public class RegisterLaboratorio
        extends JHDialog implements ActionListener, KeyListener, FocusListener {

    private JTextField txtCodigo;
    private JTextField txtDescripcion;
    private JTextField txtPais;
    private Usuario usuario;
    private final Logger logger = Logger.getLogger(RegisterLaboratorio.class);

    public RegisterLaboratorio(Frame arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    public RegisterLaboratorio(Dialog arg0, Usuario usuario) {
        super(arg0);
        this.usuario = usuario;
        inicialize();
    }

    private void inicialize() {
        JPanel pnl_dialog = new JPanel();
        pnl_dialog.setLayout(null);
        pnl_dialog.setBackground(new Color(245, 245, 245));

        Border border = BorderFactory.createTitledBorder(null, "Datos de Laboratorio", TitledBorder.LEFT, TitledBorder.DEFAULT_POSITION, new Font("Comic Sans MS", 0, 12), Color.BLACK);

        JPanel pnlLaboratorio = new JPanel();
        pnlLaboratorio.setLayout(null);
        pnlLaboratorio.setBackground(new Color(245, 245, 245));
        pnlLaboratorio.setBorder(border);

        CLabel lbl_Codigo = new CLabel("Código");
        lbl_Codigo.setBounds(35, 45, 80, 20);
        pnlLaboratorio.add(lbl_Codigo);

        txtCodigo = new JTextField();
        txtCodigo.setEditable(false);
        txtCodigo.setBounds(125, 45, 120, 20);
        pnlLaboratorio.add(txtCodigo);

        CLabel lblDescripcion = new CLabel("Descripción");
        lblDescripcion.setBounds(35, 80, 80, 20);
        pnlLaboratorio.add(lblDescripcion);

        txtDescripcion = new JTextField();
        txtDescripcion.setBounds(125, 80, 150, 20);
        txtDescripcion.setDocument(new UpperCaseNumberDocument(100));
        txtDescripcion.addKeyListener(this);
        txtDescripcion.addFocusListener(this);
        pnlLaboratorio.add(txtDescripcion);

        CLabel lblPais = new CLabel("Pais");
        lblPais.setBounds(35, 115, 80, 20);
        pnlLaboratorio.add(lblPais);

        txtPais = new JTextField();
        txtPais.setBounds(125, 115, 150, 20);
        txtPais.setDocument(new UpperCaseNumberDocument(100));
        txtPais.addKeyListener(this);
        txtPais.addFocusListener(this);
        pnlLaboratorio.add(txtPais);

        pnlLaboratorio.setBounds(20, 20, 460, 155);
        pnl_dialog.add(pnlLaboratorio);

        setTitleName("Laboratorio");
        getContentPane().add(pnl_dialog);
        setSize(new Dimension(500, 260));
        ComponentToolKit.centerComponentPosicion(this);
    }

    @Override
    public void loadCombo() {
    }

    @Override
    public void newRegister() {
        JTextField txt = new JTextField();
        txtDescripcion.setBorder(txt.getBorder());

        txtCodigo.setText("");
        txtDescripcion.setText("");

        txtDescripcion.requestFocus();
    }

    @Override
    public String executeInsert() {
        try {
            RnLaboratorioClinico regla = new RnLaboratorioClinico(path);
            return String.valueOf(regla.insertar(txtDescripcion.getText().trim(), txtPais.getText().trim()));
        } catch (Exception e) {
            ExceptionHandler.handleException(e, logger);
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
            JOptionPane.showMessageDialog(this, "Para " + namemode + " un Laboratorio, debes especificar su Descripcion.", "Datos incompletos de Laboratorio", JOptionPane.CANCEL_OPTION);
            txtDescripcion.setBorder(new LineBorder(Color.RED));
            txtDescripcion.requestFocus();

            return false;
        }

        return true;
    }

    @Override
    public boolean loadRegister() {
        try {
            RnLaboratorioClinico regla = new RnLaboratorioClinico(path);
            List<BeanLaboratorioClinico> lstLaboratorio = regla.listar(Integer.parseInt(rowSelection.getSelectedValue(1).toString()), "");

            if (lstLaboratorio.isEmpty()) {
                return false;
            }
            BeanLaboratorioClinico laboratorio = lstLaboratorio.get(0);
            txtCodigo.setText(mode == CLONE ? "" : String.valueOf(laboratorio.getIdLaboratorio()));
            txtDescripcion.setText(laboratorio.getDescripcion());
            txtPais.setText(laboratorio.getPais());
            return true;
        } catch (NumberFormatException | SQLException e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
            return false;
        }
    }

    @Override
    public String executeUpdate() {
        try {
            RnLaboratorioClinico regla = new RnLaboratorioClinico(path);
            return String.valueOf(regla.modificar(Integer.parseInt(txtCodigo.getText().trim()),
                    txtDescripcion.getText().trim(), txtPais.getText().trim()));
        } catch (NumberFormatException | SQLException e) {
            ExceptionHandler.handleException(e, logger);
            JOptionPane.showMessageDialog(this, e.getMessage());
            return "";
        }
    }

    @Override
    public boolean executeDelete() {
        try {
            RnLaboratorioClinico regla = new RnLaboratorioClinico(path);
            return regla.eliminar(Integer.parseInt(txtCodigo.getText().trim()));
        } catch (NumberFormatException | SQLException e) {
            ExceptionHandler.handleException(e, logger);
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
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void keyReleased(KeyEvent e) {
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
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
