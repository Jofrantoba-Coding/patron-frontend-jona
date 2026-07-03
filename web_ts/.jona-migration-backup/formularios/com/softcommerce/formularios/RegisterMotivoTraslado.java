
package com.softcommerce.formularios;

import com.softcommerce.beans.MotivoTraslado;
import com.softcommerce.beans.Usuario;
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
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import java.awt.Dialog;
import java.awt.Frame;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.util.ArrayList;
import java.util.List;
import javax.swing.JCheckBox;
import javax.swing.JOptionPane;
import javax.swing.JTextField;
import javax.swing.SwingConstants;
import javax.swing.border.LineBorder;
import com.softcommerce.reglasnegocio.RnMotivoTraslado;

public class RegisterMotivoTraslado extends JHDialog implements ActionListener, ItemListener, KeyListener, FocusListener
{
    private JTextField txt_Codigo;
    private JTextField txt_Descripcion;
    private JTextField txt_abrev;

    private JCheckBox chk_habguia;
    
    private Usuario usuario;

    public RegisterMotivoTraslado(Frame arg0,Usuario usuario)
    {
        super(arg0);
        this.usuario = usuario;
	inicialize();
    }

    public RegisterMotivoTraslado(Dialog arg0,Usuario usuario)
    {
        super(arg0);
        this.usuario = usuario;
	inicialize();
    }

    private void inicialize()
    {
        JPanel pnl_dialog= new JPanel();
        pnl_dialog.setLayout(null);
	pnl_dialog.setBackground(new Color(245,245,245));

        Border border =  BorderFactory.createTitledBorder(null,"Datos de Motivo Traslado", TitledBorder.LEFT,TitledBorder.DEFAULT_POSITION,new Font("Comic Sans MS",0,12),Color.BLACK);

        JPanel pnlFamilia= new JPanel();
        pnlFamilia.setLayout(null);
        pnlFamilia.setBackground(new Color(245,245,245));
        pnlFamilia.setBorder(border);

        CLabel lbl_Codigo = new CLabel("Código");
        lbl_Codigo.setBounds(35,45,80,20);
        pnlFamilia.add(lbl_Codigo);

        txt_Codigo = new JTextField();
        txt_Codigo.setEditable(false);
	txt_Codigo.setBounds(125,45,120,20);
        pnlFamilia.add(txt_Codigo);

        CLabel lbl_Descripcion = new CLabel("Descripción");
	lbl_Descripcion.setBounds(35,80,80,20);
        pnlFamilia.add(lbl_Descripcion);

        txt_Descripcion = new JTextField();
	txt_Descripcion.setBounds(125,80,150,20);
        txt_Descripcion.setDocument(new UpperCaseNumberDocument(100));
        txt_Descripcion.addKeyListener(this);
        txt_Descripcion.addFocusListener(this);
        pnlFamilia.add(txt_Descripcion);

        CLabel lbl_abrev = new CLabel("Abreviatura");
	lbl_abrev.setBounds(35,115,80,20);
        pnlFamilia.add(lbl_abrev);

        txt_abrev = new JTextField();
	txt_abrev.setBounds(125,115,50,20);
        txt_abrev.setDocument(new UpperCaseNumberDocument(100));
        txt_abrev.addKeyListener(this);
        txt_abrev.addFocusListener(this);
        pnlFamilia.add(txt_abrev);

        CLabel lbl_tipotar = new CLabel("Hab Guia");
        lbl_tipotar.setBounds(35,150,90, 20);
        pnlFamilia.add(lbl_tipotar);

        chk_habguia = new JCheckBox();
        chk_habguia.setBounds(125,150, 100,20);
        chk_habguia.addKeyListener(this);
        chk_habguia.setHorizontalTextPosition(SwingConstants.LEFT);
        chk_habguia.addFocusListener(this);
        chk_habguia.addItemListener(this);
        chk_habguia.setOpaque(false);
        pnlFamilia.add(chk_habguia);

        pnlFamilia.setBounds(20,20,460,195);
        pnl_dialog.add(pnlFamilia);

        setTitleName("Motivo Traslado");
        getContentPane().add(pnl_dialog);
        setSize(new Dimension(500,300));
	ComponentToolKit.centerComponentPosicion(this);
    }

    public void loadCombo()
    {

    }

    public void newRegister()
    {
        JTextField txt = new JTextField();
        txt_Descripcion.setBorder(txt.getBorder());

        txt_Codigo.setText("");
        txt_Descripcion.setText("");
        txt_abrev.setText("");
        chk_habguia.setSelected(false);

        txt_Descripcion.requestFocus();
    }

    public String executeInsert()
    {
        RnMotivoTraslado regla = new RnMotivoTraslado(path);

        return regla.insertar(txt_Descripcion.getText().trim(),txt_abrev.getText().trim(),usuario.getId_usuario(),(chk_habguia.isSelected()?"S":"N"));
    }

    public void focusGained(FocusEvent e)
    {
        if(txt_Descripcion == e.getSource())
            txt_Descripcion.selectAll();

        if(txt_abrev == e.getSource())
            txt_abrev.selectAll();
    }

    public void keyPressed(KeyEvent e)
    {
        if(e.getKeyCode() == KeyEvent.VK_ESCAPE)
            dispose();

        if(e.getKeyChar()=='\n')
        {
            if(e.getSource() == txt_Descripcion)
                txt_abrev.requestFocus();

            if(e.getSource() == txt_abrev)
                setFocusAndClick();
        }
    }

    public boolean isRegisterValid()
    {
        JTextField txt = new JTextField();
        txt_Descripcion.setBorder(txt.getBorder());

        if (txt_Descripcion.getText().trim().length() == 0)
        {
            JOptionPane.showMessageDialog(this,"Para " + namemode + " una Tipo Anexo, debes especificar su Descripcion.","Datos incompletos de Tipo Anexo",JOptionPane.CANCEL_OPTION);
            txt_Descripcion.setBorder(new LineBorder(Color.RED));
            txt_Descripcion.requestFocus();

            return false;
	}

        return true;
    }

    public boolean loadRegister()
    {
        RnMotivoTraslado regla = new RnMotivoTraslado(path);

        //Vector<MotivoTraslado> reg = regla.listar(rowSelection.getSelectedValue(1).toString(),"","");
        List<MotivoTraslado> reg = regla.BuscaMotivoTraslado(Integer.parseInt(rowSelection.getSelectedValue(1).toString().trim()), "", "");

        if(reg.isEmpty())

            return false;

        else
        {
            MotivoTraslado motivotraslado = reg.get(0);

            txt_Codigo.setText(mode==CLONE?"":motivotraslado.getCodigo());
            txt_Descripcion.setText(motivotraslado.getDescripcion());
            txt_abrev.setText(motivotraslado.getAbrev());
            chk_habguia.setSelected(motivotraslado.getHab_guia().equals("S")?true:false);
        }

        return true;
    }

    public String executeUpdate()
    {
        RnMotivoTraslado regla = new RnMotivoTraslado(path);

        return regla.modificar(txt_Codigo.getText().trim(),txt_Descripcion.getText().trim(),txt_abrev.getText().trim(),(chk_habguia.isSelected()?"S":"N"),usuario.getId_usuario());
    }

    public boolean executeDelete()
    {
        RnMotivoTraslado regla = new RnMotivoTraslado(path);

        return regla.eliminar(txt_Codigo.getText().trim(),usuario.getId_usuario());
    }

      @Override
    public void actionPerformed(ActionEvent e)
    {

    }

    @Override
    public void setRegisterEnabled(boolean e)
    {

    }

    public void setRegisterEditable(boolean e)
    {
        txt_Descripcion.setEditable(e);
    }

    @Override
    public void focusLost(FocusEvent e)
    {

    }

    public void prepareRegister(){}
    public boolean executeDetail() {return true;}
    public void showMessageSuccessfulInsert(){}
    public void showMessageSuccessfulUpdate(){}
    public void showMessageSuccessfulDelete(){}
    public void showMessageErrorInsert() {}
    public void showMessageErrorUpdate() {}
    public void showMessageErrorDelete() {}
    public boolean showConfirmDelete() {return true;}
    public boolean executeSelect() {return true;}
    public void addRow(String[] row) {}
    public void itemStateChanged(ItemEvent e){}
    public void keyTyped(KeyEvent e){}
    public void keyReleased(KeyEvent e){}
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
    public void loadInicioBeforeDetail() {}
    public void loadInicioAfterDetail() {}
    public void loadInicioDelete() {}
    public void addRow(Object ob, Component comp) {}
    public void setValueSearch(Object valor, Component comp) {}
    public void addRow(Object[] reg, int opcion) {}
    public ArrayList getDataTable(){return null;}
    public void addRow(Object reg[],String opcion){}
    public void removeRow(Object reg[],String opcion){}
    public void updateRow(Object reg[],String opcion){}
    public void addRow(Object ob,String opcion){}
    public void removeRow(Object ob,String opcion){}
    public void updateRow(Object ob,String opcion){}
    public void removeRow(Object ob,Component comp,int modo){}
    public void showMessagePrint(String codigo) {}
    public void updateRow(Object[] ob,Component comp,int modo){}
    public void addRow(Object[] ob, Component comp, int modo) {}
    public boolean executeAnular(){return true;}
    @Override
    public boolean loadRegister(Object o) {return true;}
}