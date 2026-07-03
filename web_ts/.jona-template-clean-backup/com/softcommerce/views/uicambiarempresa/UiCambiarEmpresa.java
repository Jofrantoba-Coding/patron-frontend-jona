package com.softcommerce.views.uicambiarempresa;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.ComponentToolKit;
import com.softcommerce.iconos.Gif;
import com.softcommerce.reglasnegocio.RnUsuario;
import java.awt.BorderLayout;
import java.awt.Color;
import java.awt.Dimension;
import java.awt.Font;
import java.awt.HeadlessException;
import java.awt.Toolkit;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.ItemEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.awt.event.WindowEvent;
import java.awt.event.WindowListener;
import java.util.HashMap;
import java.util.Iterator;
import java.util.Map;
import java.util.Vector;
import javax.swing.JButton;
import javax.swing.JComboBox;
import javax.swing.JDialog;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JPanel;
import javax.swing.JSeparator;
import javax.swing.WindowConstants;
import javax.swing.border.EmptyBorder;

public class UiCambiarEmpresa extends JDialog implements InterUiCambiarEmpresa, WindowListener, KeyListener, ActionListener, ItemListener, FocusListener {

    protected Main frmsys;
    protected Usuario usuario;
    protected Gif gif;
    protected JButton cbAceptar;
    protected JButton cbCancelar;
    protected Vector vtrEmpresa;
    protected JComboBox cbEmpres;
    //private Vector<Empresa> xempres;
    protected JComboBox cb_PuntoVenta;
    protected Vector vtrPuntoVenta;
    //private Vector<PuntoVenta> xpuntoventa;
    protected Vector<Usuario> usuarios_con_acceso = new Vector<Usuario>();
    protected java.net.URL path;

    public UiCambiarEmpresa(Main frmsys, Usuario usuario, java.net.URL path) throws HeadlessException {
        super(frmsys);
        this.path = path;
        this.frmsys = frmsys;
        this.usuario = usuario;
        inicialize();
    }

    protected void inicialize() {
        addWindowListener(this);

        gif = new Gif();

        JPanel pnlSesion = new JPanel();
        pnlSesion.setLayout(new BorderLayout());
        pnlSesion.setBackground(Color.WHITE);

        JLabel lblTitle = new JLabel("Punto Venta");
        lblTitle.setOpaque(true);
        lblTitle.setFont(new Font(Font.SANS_SERIF, 1, 14));
        lblTitle.setForeground(new Color(255, 255, 255));
        lblTitle.setBackground(new Color(35, 117, 152));
        lblTitle.setPreferredSize(new Dimension(0, 25));
        lblTitle.setBorder(new EmptyBorder(0, 10, 0, 0));
        pnlSesion.add(lblTitle, BorderLayout.NORTH);

        JPanel pnl = new JPanel();
        pnl.setLayout(null);
        pnl.setBackground(new Color(238, 238, 238));

        JLabel lblImagenSeguridad = new JLabel();
        lblImagenSeguridad = new JLabel(gif.EMPRESABIG);
        lblImagenSeguridad.setBounds(15, 5, gif.EMPRESABIG.getIconWidth(), gif.EMPRESABIG.getIconHeight());
        pnl.add(lblImagenSeguridad);

        JLabel lblEmpresa = new JLabel("Empesa");
        lblEmpresa.setBounds(130, 20, 40, 20);
        pnl.add(lblEmpresa);

        vtrEmpresa = new Vector();
        cbEmpres = new JComboBox(vtrEmpresa);
        cbEmpres.setBounds(190, 20, 200, 20);
        cbEmpres.addKeyListener(this);
        cbEmpres.addActionListener(this);
        pnl.add(cbEmpres);

        JLabel lbl_LocalDespacho = new JLabel("P. Venta");
        lbl_LocalDespacho.setBounds(130, 50, 80, 20);
        pnl.add(lbl_LocalDespacho);

        vtrPuntoVenta = new Vector();
        cb_PuntoVenta = new JComboBox(vtrPuntoVenta);
        cb_PuntoVenta.setBounds(190, 50, 210, 20);
        cb_PuntoVenta.addActionListener(this);
        cb_PuntoVenta.setEnabled(false);
        cb_PuntoVenta.addKeyListener(this);
        pnl.add(cb_PuntoVenta);

        JSeparator jsep2 = new JSeparator();
        jsep2.setBounds(20, 100, 446, 5);
        pnl.add(jsep2);

        cbCancelar = new JButton("Cancelar");
        cbCancelar.addKeyListener(this);
        cbCancelar.addActionListener(this);
        cbCancelar.setBounds(310, 110, 90, 25);
        pnl.add(cbCancelar);

        cbAceptar = new JButton("Aceptar");
        cbAceptar.addKeyListener(this);
        cbAceptar.addActionListener(this);
        cbAceptar.setBounds(180, 110, 120, 25);
        pnl.add(cbAceptar);

        pnlSesion.add(pnl, BorderLayout.CENTER);

        setDefaultCloseOperation(WindowConstants.DISPOSE_ON_CLOSE);

        Dimension d = Toolkit.getDefaultToolkit().getScreenSize();
        int sr = Toolkit.getDefaultToolkit().getScreenResolution();

        setSize(new Dimension(435, 200));
        setResizable(false);
        setContentPane(pnlSesion);
        setModal(true);
        setTitle("Cambiar Establecimiento");

        loadEmpresa();

        ComponentToolKit.centerComponentPosicion(this);
    }

    protected void loadEmpresa() {
    }

    public void windowClosing(WindowEvent e) {
        dispose();
    }
    
    protected void cargarPtoVta() {
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (cbCancelar == e.getSource()) {
            dispose();
        }

        if (cbEmpres == e.getSource()) {
            if (!vtrEmpresa.isEmpty()) {
                vtrPuntoVenta.clear();
                cb_PuntoVenta.removeAllItems();

                cb_PuntoVenta.setEnabled(true);

                for (int i = 0; i < usuarios_con_acceso.size(); i++) {
                    if (usuarios_con_acceso.get(i).getDescriempresa().equals(cbEmpres.getSelectedItem())) {
                        vtrPuntoVenta.add(usuarios_con_acceso.get(i).getDescripuntoventa());
                    }
                }

                if (cb_PuntoVenta.getItemCount() > 0) {
                    cb_PuntoVenta.setSelectedIndex(0);
                }
                cargarPtoVta();
            }
        }

        if (cbAceptar == e.getSource()) {
            Usuario usuario_nuevo = null;

            for (int i = 0; i < usuarios_con_acceso.size(); i++) {
                if (usuarios_con_acceso.get(i).getDescriempresa().equals(cbEmpres.getSelectedItem().toString()) && usuarios_con_acceso.get(i).getDescripuntoventa().equals(cb_PuntoVenta.getSelectedItem().toString())) {
                    usuario_nuevo = usuarios_con_acceso.get(i);
                    break;
                }
            }

            usuario_nuevo.setPass_ce(usuario.getPass_ce());
            usuario_nuevo.setPass_se(usuario.getPass_se());
            frmsys.setUsuario(usuario_nuevo);
            dispose();
        }
    }

    public void keyPressed(KeyEvent e) {
        if (e.getKeyCode() == KeyEvent.VK_ESCAPE) {
            dispose();
        }

        if (e.getKeyChar() == '\n') {
            if (e.getSource() == cb_PuntoVenta) {
                cb_PuntoVenta.requestFocus();
            }

            if (e.getSource() == cb_PuntoVenta) {
                cbAceptar.doClick();
            }
        }
    }

    public void focusGained(FocusEvent e) {
    }

    @Override
    public void windowOpened(WindowEvent e) {
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
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void keyReleased(KeyEvent e) {
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
    }

    @Override
    public void focusLost(FocusEvent e) {
    }
}
