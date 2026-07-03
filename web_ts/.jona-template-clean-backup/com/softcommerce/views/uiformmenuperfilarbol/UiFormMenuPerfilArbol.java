/*
 * To change this template, choose Tools | Templates
 * and open the template in the editor.
 */
package com.softcommerce.views.uiformmenuperfilarbol;


import com.softcommerce.formularios.*;
import com.softcommerce.beans.MenuDinamico;
import com.softcommerce.beans.BeanTipoTrabajador;
import com.softcommerce.beans.BeanTipoTrabajadorPerfil;
import com.softcommerce.beans.Usuario;
import com.softcommerce.general.controles.CTable;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import com.softcommerce.general.tablas.TipoTrabajadorPerfilTableModel;
import com.softcommerce.reglasnegocio.RnTipoTrabajador;
import com.softcommerce.reglasnegocio.RnTipoTrabajadorPerfil;
import com.softcommerce.reglasnegocio.RnUsuario;
import com.softcommerce.util.BeanTreeModel;
import com.softcommerce.util.render.BeanTreeRenderer;
import com.softcommerce.util.editor.EditorTree;
import com.softcommerce.util.Propiedad;
//import com.softcommerce.util.Render;
import com.softcommerce.util.TreeEntryBean;
import java.awt.Color;
import java.awt.Dimension;
import javax.swing.JButton;
import javax.swing.JDialog;
import javax.swing.JFrame;
import javax.swing.JPanel;
import java.awt.BorderLayout;
import java.awt.Font;
import java.awt.event.ActionEvent;
import java.awt.event.ActionListener;
import java.awt.event.FocusEvent;
import java.awt.event.FocusListener;
import java.awt.event.KeyEvent;
import java.awt.event.KeyListener;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import javax.swing.JComboBox;
import javax.swing.JLabel;
import javax.swing.JOptionPane;
import javax.swing.JScrollPane;
import javax.swing.JSplitPane;
import javax.swing.JTextField;
import javax.swing.JTree;
import javax.swing.RowFilter;
import javax.swing.border.LineBorder;
import javax.swing.event.ListSelectionEvent;
import javax.swing.event.ListSelectionListener;
//import javax.swing.event.TreeSelectionListener;
//import javax.swing.table.DefaultTableCellRenderer;
//import javax.swing.table.DefaultTableModel;
import javax.swing.table.TableRowSorter;
import javax.swing.tree.TreePath;
import javax.swing.tree.TreeSelectionModel;
//import org.jdesktop.swingx.JXTable;

/**
 *
 * @author Team Develtrex
 */
public class UiFormMenuPerfilArbol extends JDialog implements InterUiFormMenuPerfilArbol, ListSelectionListener, ActionListener, FocusListener, KeyListener {

    protected java.net.URL path;
    protected Usuario usuario;
    protected JPanel pnlCabecera;
    protected JPanel pnlTable;
    //private JToolBar jtbOpciones;
    //private JButton btnNuevo;
    protected BeanTreeModel arbolContenido = new BeanTreeModel();
    protected BeanTreeRenderer render;
    protected JTree arbol = new JTree();
    protected JScrollPane arbolScrollPane = new JScrollPane(JScrollPane.VERTICAL_SCROLLBAR_AS_NEEDED, JScrollPane.HORIZONTAL_SCROLLBAR_NEVER);
    protected JPanel pnlLeft;
    protected JPanel pnlRigth;
    protected JSplitPane contenido;
    public CTable table;
    public TipoTrabajadorPerfilTableModel modeltable;
    public TableRowSorter modeloOrdenado;
    protected JScrollPane scrollLeft;
    protected JTextField txt_descripcion;
    protected List<BeanTipoTrabajador> xTipotrabajador;
    protected JComboBox cbo_TipoTrabajador;
    protected JButton btn_Perfil;
    protected JButton btn_Guardar;
    protected JButton btn_Formulario;
    protected JButton btn_FormularioPerfil;
    protected JLabel lbl_Perfil;
    protected int idPerfil = -1;
    protected Map<Integer, String> mapMenu;
    protected TreeEntryBean nodoRoot;
    protected BeanTipoTrabajadorPerfil beanPerfil;
    List<MenuDinamico> listado;

    /*public static void main(String[] args) {
     // TODO Auto-generated method stub

     UiFormMenuPerfilArbol theEntry = new UiFormMenuPerfilArbol();
     theEntry.setVisible(true);
     }*/
    public UiFormMenuPerfilArbol() {
        super();
        Propiedad p = new Propiedad();
        this.path = p.getDbSys();
        initComponents();
    }

    public UiFormMenuPerfilArbol(JFrame frame, Usuario usuario, java.net.URL ruta) {
        super(frame);
        this.usuario = usuario;
        this.path = ruta;
        initComponents();
    }

    public UiFormMenuPerfilArbol(JFrame frame, Usuario usuario, java.net.URL ruta, boolean modal) {
        super(frame, modal);
        this.usuario = usuario;
        this.path = ruta;
        initComponents();
        //cargarPerfil();
    }

    protected void initComponents() {
        pnlLeft = new JPanel();
        pnlLeft.setLayout(new BorderLayout());
        pnlRigth = new JPanel();
        pnlRigth.setLayout(new BorderLayout());
        lbl_Perfil = new JLabel("Perfil");
        lbl_Perfil.setBounds(60, 10, 300, 20);
        JPanel pnlCabRigth = new JPanel();
        pnlCabRigth.setLayout(new BorderLayout());
        pnlCabRigth.add(lbl_Perfil);
        pnlCabRigth.setPreferredSize(new Dimension(500, 40));
        pnlCabRigth.setBorder(new LineBorder(new Color(130, 135, 144)));
        pnlRigth.add(pnlCabRigth, BorderLayout.NORTH);
        pnlRigth.add(arbolScrollPane, BorderLayout.CENTER);
        JPanel pnlOptRigth = new JPanel();
        pnlOptRigth.setBorder(new LineBorder(new Color(130, 135, 144)));
        btn_Guardar = new JButton("Guardar");
        btn_Guardar.setBounds(60, 10, 150, 20);
        btn_Guardar.addActionListener(this);
        btn_Guardar.setEnabled(false);
        pnlOptRigth.add(btn_Guardar);
        btn_Formulario = new JButton("Permisos");
        btn_Formulario.setBounds(60, 10, 150, 20);
        btn_Formulario.addActionListener(this);
        btn_Formulario.setEnabled(false);
        pnlOptRigth.add(btn_Formulario);
        pnlOptRigth.setPreferredSize(new Dimension(500, 40));
        pnlRigth.add(pnlOptRigth, BorderLayout.SOUTH);
        contenido = new JSplitPane(JSplitPane.HORIZONTAL_SPLIT, true, pnlLeft, pnlRigth);
        pnlCabecera = new JPanel();
        pnlCabecera.setLayout(new BorderLayout(0, 1));
        pnlTable = new JPanel();
        pnlTable.setLayout(new BorderLayout());
        //jtbOpciones = new JToolBar();
        //jtbOpciones.setRollover(true);
        //btnNuevo = new JButton("Nuevo");
        //jtbOpciones.add(btnNuevo);
        //pnlCabecera.add(jtbOpciones, BorderLayout.NORTH);

        //getContentPane().add(pnlCabecera, BorderLayout.PAGE_START);

        arbolScrollPane.setViewportView(arbol);
        contenido.setContinuousLayout(true);
        contenido.setOneTouchExpandable(true);
        contenido.setDividerLocation(500);
        contenido.setPreferredSize(new Dimension(800, 500));
        construirTabla();
        construirArbol(-1);
        pnlTable.add(contenido, java.awt.BorderLayout.CENTER);
        getContentPane().add(pnlTable, java.awt.BorderLayout.CENTER);
        pack();
    }

    protected void construirTabla() {
        modeltable = new TipoTrabajadorPerfilTableModel();
        modeloOrdenado = new TableRowSorter(modeltable);
        table = new CTable();
        table.setRowSorter(modeloOrdenado);
        table.setModel(modeltable);
        table.setAllTableNoEditable();
        table.setAllColumnNoResizable();
        table.setRendererColumnZero();
        table.setAllColumnPreferredWidth();
        table.setNoVisibleColumn(3);
        table.getSelectionModel().addListSelectionListener(this);
        scrollLeft = new JScrollPane(table);
        JPanel pnlaux = new JPanel();
        pnlaux.setLayout(new BorderLayout(0, 0));
        JPanel panel = getPanelFilter();
        panel.setPreferredSize(new Dimension(500, 40));
        pnlaux.add(panel, BorderLayout.NORTH);

        scrollLeft.setPreferredSize(new Dimension(500, 340));
        pnlaux.add(scrollLeft, BorderLayout.CENTER);
        JPanel pnlOptLeft = new JPanel();
        pnlOptLeft.setBorder(new LineBorder(new Color(130, 135, 144)));
        btn_Perfil = new JButton("Perfil");
        btn_Perfil.setBounds(60, 10, 150, 20);
        btn_Perfil.addActionListener(this);
        pnlOptLeft.add(btn_Perfil);
        btn_FormularioPerfil = new JButton("Permisos de Formulario");
        //btn_FormularioPerfil.setBounds(60, 10, 150, 20);
        btn_FormularioPerfil.addActionListener(this);
        pnlOptLeft.add(btn_FormularioPerfil);
        pnlOptLeft.setPreferredSize(new Dimension(500, 40));
        pnlaux.add(pnlOptLeft, BorderLayout.SOUTH);

        pnlLeft.add(pnlaux);
        cargarTablaTipoTrabajador();
        loadTipoTrabajador();
    }

    protected void cargarTablaTipoTrabajador() {
    }

    protected RowFilter getFilter() {
        return null;
    }

    protected JPanel getPanelFilter() {
        JPanel pnlp = new JPanel();
        pnlp.setBorder(new LineBorder(new Color(130, 135, 144)));
        pnlp.setLayout(null);

        JLabel lblDescripcion = new JLabel("Desc.");
        lblDescripcion.setFont(new Font("Verdana", 0, 11));
        lblDescripcion.setBounds(15, 10, 35, 20);
        pnlp.add(lblDescripcion);

        txt_descripcion = new JTextField();
        txt_descripcion.setBounds(60, 10, 150, 20);
        txt_descripcion.addFocusListener(this);
        txt_descripcion.setFont(new Font("Garamond", 0, 14));
        txt_descripcion.setDocument(new UpperCaseNumberDocument(255));
        txt_descripcion.addKeyListener(this);
        pnlp.add(txt_descripcion);

        JLabel lbl_tipoTrabajador = new JLabel("T Trabajador");
        lbl_tipoTrabajador.setFont(new Font("Verdana", 0, 11));
        lbl_tipoTrabajador.setBounds(230, 10, 75, 20);
        pnlp.add(lbl_tipoTrabajador);

        cbo_TipoTrabajador = new JComboBox();
        cbo_TipoTrabajador.addActionListener(this);
        cbo_TipoTrabajador.setBounds(310, 10, 180, 20);
        pnlp.add(cbo_TipoTrabajador);

        return pnlp;
    }

    protected void loadTipoTrabajador() {
    }

    public void construirArbol(int id_tipo_perfil) {
    }

    protected void llenarArbol(TreeEntryBean nodo) {
        MenuDinamico beanmenuPadre = (MenuDinamico) nodo.getBean();
        for (int i = 0; i < listado.size(); i++) {
            MenuDinamico beanmenu = (MenuDinamico) listado.get(i);
            if (beanmenuPadre.getId_menu() == beanmenu.getId_menu_padre()) {
                TreeEntryBean hijoRoot = new TreeEntryBean(beanmenu.getDescripcion(), beanmenu);
                mapMenu.put(beanmenu.getId_menu(), beanmenu.getVisible());
                nodo.getHijos().add(hijoRoot);
                llenarArbol(hijoRoot);
            }
        }
    }

    protected String posHijo(TreeEntryBean beanTree, int nivel, int id_padre) {
        if (nivel == 1) {
            for (int i = 0; i < beanTree.getHijos().size(); i++) {
                TreeEntryBean beanEntry = (TreeEntryBean) beanTree.getHijos().get(i);
                MenuDinamico menu = (MenuDinamico) beanEntry.getBean();
                if (menu.getId_menu() == id_padre) {
                    return String.valueOf(i);
                }
            }
        } else if (nivel == 2) {
            for (int i = 0; i < beanTree.getHijos().size(); i++) {
                TreeEntryBean beanEntry = (TreeEntryBean) beanTree.getHijos().get(i);
                for (int j = 0; j < beanEntry.getHijos().size(); j++) {
                    TreeEntryBean beanNodo = (TreeEntryBean) beanEntry.getHijos().get(j);
                    MenuDinamico menu = (MenuDinamico) beanNodo.getBean();
                    if (menu.getId_menu() == id_padre) {
                        return String.valueOf(i) + "," + String.valueOf(j);
                    }
                }
            }
        } else if (nivel == 3) {
            for (int i = 0; i < beanTree.getHijos().size(); i++) {
                TreeEntryBean beanEntry = (TreeEntryBean) beanTree.getHijos().get(i);
                for (int j = 0; j < beanEntry.getHijos().size(); j++) {
                    TreeEntryBean beanNodo = (TreeEntryBean) beanEntry.getHijos().get(j);
                    for (int k = 0; k < beanNodo.getHijos().size(); k++) {
                        TreeEntryBean beanHijo = (TreeEntryBean) beanNodo.getHijos().get(k);
                        MenuDinamico menu = (MenuDinamico) beanHijo.getBean();
                        if (menu.getId_menu() == id_padre) {
                            //return String.valueOf(i) + "," + String.valueOf(j);
                            return String.valueOf(j) + "," + String.valueOf(k);
                        }
                    }
                }
            }
        }
        return "";
    }

    protected void filtrar() {
    }

    protected void mostrarMenuPerfil() {
    }

    protected void guardarMenuPerfil() {
    }

    protected void permisoFormulario() {
    }

    protected void permisoFormularioPerfil() {
    }

    protected String obtenerNodosArbol(TreeEntryBean nodo) {
        return null;
    }

    protected String visibleListado(int id_menu) {
        return mapMenu.get(id_menu).toString();
    }

    @Override
    public void valueChanged(ListSelectionEvent e) {
        //throw new UnsupportedOperationException("Not supported yet.");
    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == btn_Perfil) {
            mostrarMenuPerfil();
        }
        if (e.getSource() == btn_Guardar) {
            guardarMenuPerfil();
        }
        if (e.getSource() == btn_Formulario) {
            permisoFormulario();
        }
        if (e.getSource() == btn_FormularioPerfil) {
            permisoFormularioPerfil();
        }
        if (cbo_TipoTrabajador == e.getSource()) {
            if (cbo_TipoTrabajador.getItemCount() > 0) {
                filtrar();
            }
        }
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() == txt_descripcion) {
            txt_descripcion.selectAll();
        }
    }

    @Override
    public void focusLost(FocusEvent e) {
    }

    @Override
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void keyPressed(KeyEvent e) {
    }

    @Override
    public void keyReleased(KeyEvent e) {
        if (e.getKeyChar() != '\n') {
            if ((e.getSource() == txt_descripcion)) {
                filtrar();
            }
        }
    }
}
