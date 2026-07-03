
package com.softcommerce.formularios;

import com.softcommerce.beans.ClasifInventario;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CLabel;
import com.softcommerce.general.controles.CRadioButton;
import com.softcommerce.general.controles.ComponentToolKit;
import java.awt.Component;
import java.awt.event.FocusEvent;
import java.util.ArrayList;
import com.softcommerce.general.controles.AbstractRegister;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
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
import javax.swing.border.Border;
import javax.swing.border.TitledBorder;
import java.awt.Dimension;
import java.awt.Frame;
import java.awt.event.FocusListener;
import java.util.List;
import javax.swing.ButtonGroup;
import javax.swing.JOptionPane;
import javax.swing.JTextField;
import javax.swing.border.LineBorder;
import com.softcommerce.reglasnegocio.rn_ClasifInventario;


public class RegisterClasifInventario extends AbstractRegister implements ActionListener, ItemListener, KeyListener,FocusListener
{
    private JTextField txt_Codigo;
    private JTextField txt_Descripcion;
    private JTextField txt_Abrev;

    private CRadioButton rb_TipoMovInvEntrada;
    private CRadioButton rb_TipoMovInvSalida;
    private CRadioButton rb_TipoMovInvNinguno;
    private ButtonGroup bg_TipoMovInv;

    private String codigo;
    private String descripcion;
    private String abreviatura;
    private String tipomovimiento;

    private Usuario usuario = new Usuario();

    public RegisterClasifInventario(Frame arg0,Usuario usuario)
    {
        super(arg0);
        this.usuario = usuario;
	inicialize();
    }

    public RegisterClasifInventario(Dialog arg0,Usuario usuario)
    {
        super(arg0);
        this.usuario = usuario;
	inicialize();
    }

    public void inicialize()
    {
        JPanel pnl_dialog = new JPanel();
	pnl_dialog.setLayout(null);
        pnl_dialog.setBackground(new Color(245,245,245));

        Border border =  BorderFactory.createTitledBorder(null,"Datos de Unidad de Medida", TitledBorder.LEFT,TitledBorder.DEFAULT_POSITION,new Font("Comic Sans MS",0,12),Color.BLACK);

        JPanel pnlTipoMovInven= new JPanel();
        pnlTipoMovInven.setLayout(null);
        pnlTipoMovInven.setBorder(border);
        pnlTipoMovInven.setBackground(new Color(245,245,245));

        CLabel lbl_Codigo  = new CLabel("Código");
        lbl_Codigo.setBounds(35,45,120,20);
        pnlTipoMovInven.add(lbl_Codigo);

        txt_Codigo = new JTextField();
        txt_Codigo.setEditable(false);
        txt_Codigo.setBounds(165,45,80,20);
        pnlTipoMovInven.add(txt_Codigo);

        CLabel lbl_Descripcion = new CLabel("Descripción");
        lbl_Descripcion.setBounds(35,80,120,20);
        pnlTipoMovInven.add(lbl_Descripcion);

        txt_Descripcion = new JTextField();
        txt_Descripcion.setBounds(165,80,250,20);
        txt_Descripcion.addKeyListener(this);
        txt_Descripcion.setDocument(new UpperCaseNumberDocument(100));
        txt_Descripcion.addFocusListener(this);
        pnlTipoMovInven.add(txt_Descripcion);

        CLabel lbl_Abrev = new CLabel("Abreviatura");
	lbl_Abrev.setBounds(35,115,120,20);
        pnlTipoMovInven.add(lbl_Abrev);

        txt_Abrev = new JTextField();
        txt_Abrev.setBounds(165,115,120,20);
        txt_Abrev.addKeyListener(this);
        txt_Abrev.setDocument(new UpperCaseNumberDocument(100));
        txt_Abrev.addFocusListener(this);
        pnlTipoMovInven.add(txt_Abrev);

        CLabel lbl_TipoMovInv = new CLabel("Tipo de Movimiento");
	lbl_TipoMovInv.setBounds(35,150,160,20);
        pnlTipoMovInven.add(lbl_TipoMovInv);

        rb_TipoMovInvEntrada = new CRadioButton("Entrada");
	rb_TipoMovInvEntrada.setBounds(160,150,120,20);
        rb_TipoMovInvEntrada.addKeyListener(this);
        pnlTipoMovInven.add(rb_TipoMovInvEntrada);

        rb_TipoMovInvSalida = new CRadioButton("Salida");
	rb_TipoMovInvSalida.setBounds(275,150,120,20);
        rb_TipoMovInvSalida.addKeyListener(this);
        pnlTipoMovInven.add(rb_TipoMovInvSalida);

        rb_TipoMovInvNinguno = new CRadioButton();
        rb_TipoMovInvNinguno.addKeyListener(this);

        bg_TipoMovInv = new ButtonGroup();
        bg_TipoMovInv.add(rb_TipoMovInvEntrada);
        bg_TipoMovInv.add(rb_TipoMovInvNinguno);
        bg_TipoMovInv.add(rb_TipoMovInvSalida);

        pnlTipoMovInven.setBounds(25,25,450,190);
        pnl_dialog.add(pnlTipoMovInven);

        setTitleName("Tipo de Movimiento de Inventario");
        setRegister(pnl_dialog);
        setSize(new Dimension(515,310));
        ComponentToolKit.centerComponentPosicion(this);
    }

    public void keyPressed(KeyEvent e)
    {
    	if (e.getKeyCode() == KeyEvent.VK_ESCAPE)
            setVisible(false);

        if(e.getKeyChar()=='\n')
        {
            if(e.getSource() == txt_Descripcion)
                txt_Abrev.requestFocus();

            if(e.getSource() == txt_Abrev)
                rb_TipoMovInvEntrada.requestFocus();

            if(e.getSource() == rb_TipoMovInvEntrada)
                rb_TipoMovInvSalida.requestFocus();

            if(e.getSource()==rb_TipoMovInvSalida)
                setFocusAndClick();
        }

        else if(e.getKeyChar() == KeyEvent.VK_SPACE)
        {
            if(e.getSource() == rb_TipoMovInvEntrada)
            {
                rb_TipoMovInvEntrada.setSelected(true);
                setFocusAndClick();
            }


            if(e.getSource() == rb_TipoMovInvSalida)
            {
                rb_TipoMovInvSalida.setSelected(true);
                setFocusAndClick();
            }
        }
    }

    public void newRegister()
    {
        JTextField txt = new JTextField();
        txt_Descripcion.setBorder(txt.getBorder());
        txt_Abrev.setBorder(txt.getBorder());
        rb_TipoMovInvEntrada.setForeground(txt.getForeground());
        rb_TipoMovInvSalida.setForeground(txt.getForeground());

        txt_Codigo.setText("");
        txt_Descripcion.setText("");
        txt_Abrev.setText("");
        rb_TipoMovInvNinguno.setSelected(true);

        if(mode == DETAIL)
            setVisiblePreviusAndNext(false);

        txt_Descripcion.requestFocus();
    }


    public boolean loadRegister()
    {
        rn_ClasifInventario regla = new rn_ClasifInventario(path);

        codigo = rowSelection.getSelectedValue(1).toString();

        List<ClasifInventario> reg = (ArrayList)regla.listar(codigo,"","","");

        if(reg.isEmpty())

            return false;

        else
        {
            if(mode!= CLONE)
                txt_Codigo.setText(reg.get(0).getid_clasif_inventario());

            txt_Descripcion.setText(reg.get(0).getDescripcion());
            txt_Abrev.setText(reg.get(0).getAbrev());

            if(reg.get(0).getTipo().equals("ENTRADA"))
                rb_TipoMovInvEntrada.setSelected(true);
            else
                rb_TipoMovInvSalida.setSelected(true);
        }

        return true;
    }

    public void setRegisterEditable(boolean e)
    {
        txt_Descripcion.setEditable(e);
        txt_Abrev.setEditable(e);
    }

    public void setRegisterEnabled(boolean e)
    {
        rb_TipoMovInvEntrada.setEnabled(e);
        rb_TipoMovInvSalida.setEnabled(e);
    }

    public void prepareRegister()
    {
        codigo = txt_Codigo.getText().trim();

        if(mode !=DELETE)
        {
            descripcion =    txt_Descripcion.getText().trim();
            abreviatura =    txt_Abrev.getText().trim();
            tipomovimiento = rb_TipoMovInvEntrada.isSelected()?"E":"S";
        }
    }

    public String executeUpdate()
    {
        rn_ClasifInventario regla = new rn_ClasifInventario(path);

        return regla.modificar(codigo,descripcion,abreviatura,tipomovimiento,usuario.getId_usuario());
    }

    public String executeInsert()
    {
        rn_ClasifInventario regla = new rn_ClasifInventario(path);

        return regla.insertar(descripcion,abreviatura, tipomovimiento,usuario.getId_usuario());
    }

    public boolean executeDelete()
    {
        rn_ClasifInventario regla = new rn_ClasifInventario(path);

        return regla.eliminar(codigo,usuario.getId_usuario());
    }

    public boolean isRegisterValid()
    {
        JTextField txt = new JTextField();
        txt_Descripcion.setBorder(txt.getBorder());
        txt_Abrev.setBorder(txt.getBorder());
        rb_TipoMovInvEntrada.setForeground(txt.getForeground());
        rb_TipoMovInvSalida.setForeground(txt.getForeground());

        if (txt_Descripcion.getText().trim().length() == 0)
        {
            JOptionPane.showMessageDialog(this,"Para " + nameMode + " un Tipo de Movimiento de Inventario, debes especificar su Descripcion.","Datos incompletos de Tipo de Movimiento de Inventario",JOptionPane.CANCEL_OPTION);
            txt_Descripcion.setBorder(new LineBorder(Color.RED));
            txt_Descripcion.requestFocus();

            return false;
	}

        if (txt_Abrev.getText().trim().length() == 0)
        {
            JOptionPane.showMessageDialog(this,"Para " + this.nameMode + " un Tipo de Movimiento de Inventario, debes " +"especificar su Abreviatura.","Datos incompletos de Tipo de Movimiento de Inventario",2);
            txt_Abrev.setBorder(new LineBorder(Color.RED));
            txt_Abrev.requestFocus();

            return false;
        }

        if (!rb_TipoMovInvEntrada.isSelected() && !rb_TipoMovInvSalida.isSelected())
        {
            JOptionPane.showMessageDialog(this, "Para " + this.nameMode + " un Tipo de Movimiento de Inventario, debes " + "especificar su Tipo de Movimiento.","Datos incompletos de Tipo de Movimiento de Inventario",2);
            this.rb_TipoMovInvEntrada.setForeground(Color.red);
            this.rb_TipoMovInvSalida.setForeground(Color.red);
            rb_TipoMovInvEntrada.requestFocus();

            return false;
        }

        return true;

    }

    public void focusGained(FocusEvent e)
    {
        if(e.getSource()==txt_Abrev)
            txt_Abrev.requestFocus();

        if(e.getSource()==txt_Descripcion)
            txt_Descripcion.requestFocus();
    }

    public void actionPerformed(ActionEvent e){}
    public void itemStateChanged(ItemEvent e){}
    public void keyTyped(KeyEvent e){}
    public void keyReleased(KeyEvent e){}
    public boolean executeDetail() {return true;}
    public void showMessageSuccessfulInsert() {}
    public void showMessageSuccessfulUpdate() {}
    public void showMessageSuccessfulDelete() {}
    public void showMessageErrorInsert() {}
    public void showMessageErrorUpdate() {}
    public void showMessageErrorDelete() {}
    public boolean showConfirmDelete() {return true;}
    public boolean executeSelect() {return true;}
    public void addRow(String[] row) {}
    public void loadCombo() {}
    public void addRow(Object[] reg) {}
    public void setParametersRegister(ArrayList data, String[] columnNames) {}
    public void loadInicio() {}
    public void showSearchDialog() {}
    public void loadInicioUDD() {}
    public void loadInicioInsert() {}
    public void addRow(Object ob, int index) {}
    public void addRow(Object ob, int index, int cantidad) {}
    public void addRow(Object ob, int index, int cantidad, double participacion) {}
    public void removeRow(Object ob,int opcion){}
    public void addRow(Object ob, int cantidad, double participacion) {}
    public void addDataRow(Object ob, int cantidad, double participacion) {}
    public void updateRow(Object ob,int opcion) {}
    public void addRow(Object ob) {}
    public void loadInicioUpdate() {}
    public ArrayList getDataTable(){return null;}
    public void loadInicioBeforeDetail() {}
    public void loadInicioAfterDetail() {}
    public void loadInicioDelete() {}
    public void addRow(Object ob, Component comp) {}
    public void setValueSearch(Object valor, Component comp) {}
    public void addRow(Object[] reg, int opcion) {}
    public void addRow(Object reg[],String opcion){}
    public void removeRow(Object reg[],String opcion){}
    public void updateRow(Object reg[],String opcion){}
    public void addRow(Object ob,String opcion){}
    public void removeRow(Object ob,String opcion){}
    public void updateRow(Object ob,String opcion){}
    public void addRow(Object[] ob, Component comp, int modo) {}
    public void showMessagePrint(String codigo) {}
    public void removeRow(Object ob, Component comp, int modo) {}
    public void updateRow(Object[] ob, Component comp, int modo) {}
    public void focusLost(FocusEvent e) {}
    public boolean executeAnular()
    {
        return true;
    }
}