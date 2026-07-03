package com.softcommerce.views.uipaneltfserviciotransporte;


import com.softcommerce.formularios.*;
import com.softcommerce.accesoDatos.DAOServicioTransporte;
import com.softcommerce.beans.Almacen;
import com.softcommerce.beans.ContaCab;
import com.softcommerce.beans.Usuario;
import com.toedter.calendar.JDateChooser;
import com.toedter.calendar.JTextFieldDateEditor;
import com.softcommerce.general.controles.JHInternalFrame;
import java.awt.Color;
import com.softcommerce.general.controles.Register;
import java.awt.Cursor;
import java.awt.event.ItemEvent;
import java.awt.event.KeyAdapter;
import java.awt.event.MouseAdapter;
import java.awt.event.MouseEvent;
import java.awt.Font;
import java.beans.PropertyChangeEvent;
import java.util.ArrayList;
import javax.swing.JLabel;
import javax.swing.JPanel;
import javax.swing.JTextField;
import javax.swing.border.LineBorder;
import javax.swing.event.ListSelectionEvent;
import com.softcommerce.general.controles.CTable;
import javax.swing.RowFilter.ComparisonType;
import com.softcommerce.general.controles.UpperCaseNumberDocument;
import java.awt.BorderLayout;
import javax.swing.JScrollPane;
import javax.swing.table.TableRowSorter;
import com.softcommerce.reglasnegocio.RnRegContaCab;
import com.softcommerce.report.Reporte;
import com.softcommerce.general.controles.ControlView;
import com.softcommerce.general.herramientas.DateTime;
import java.awt.event.WindowListener;
import javax.swing.event.ListSelectionListener;
import java.awt.Component;
import java.awt.Dimension;
import java.awt.event.ActionListener;
import java.awt.event.FocusListener;
import java.awt.event.WindowEvent;
import java.awt.event.KeyListener;
import java.awt.event.ActionEvent;
import java.awt.event.FocusEvent;
import java.awt.event.ItemListener;
import java.awt.event.KeyEvent;
import java.awt.event.MouseListener;
import java.beans.PropertyChangeListener;
import java.util.Date;
import java.util.List;
import javax.swing.JComboBox;
import javax.swing.JComponent;
import javax.swing.JDesktopPane;
import javax.swing.JFrame;
import javax.swing.JOptionPane;
import javax.swing.KeyStroke;
import javax.swing.RowFilter;
import javax.swing.event.InternalFrameEvent;
import com.softcommerce.reglasnegocio.RnAlmacen;
import com.softcommerce.general.tablas.ServicioTableModel;
import com.softcommerce.util.ExportExcel;
import java.util.HashMap;
import java.util.Map;
import javax.swing.JButton;
import javax.swing.JDialog;

/**
 *
 * @author TOSHIBA
 */
public class UiPanelTFServicioTransporte extends JHInternalFrame implements InterUiPanelTFServicioTransporte, ListSelectionListener, ControlView, WindowListener, FocusListener, KeyListener, ActionListener, MouseListener, PropertyChangeListener, ItemListener {

    private static final long serialVersionUID = 1L;
    public CTable table = null;
    public ServicioTableModel modeltable;
    public TableRowSorter<ServicioTableModel> modeloOrdenado;
    public JScrollPane scroll;

    protected JTextField txt_idservicio;
    protected JTextField txt_tmpanexo;
    protected JTextField txt_tmpruc;

    protected List<Almacen> x_idalmacen;
    protected JComboBox cbo_idalmacen;
    protected Date fechaInicio;
    protected Date fechaFin;
    protected JDateChooser dc_fechainicio;
    protected JDateChooser dc_fechafin;
    protected RegisterServicioTransporte registeri;
    protected JDesktopPane jdp;
    protected Usuario usuario;
    protected Main frame;

    public UiPanelTFServicioTransporte(String title, Main frame, JDesktopPane jdp, Usuario usuario) {
        super(title + " - Panel Serv.Transporte");
        this.usuario = usuario;
        this.frame = frame;
        this.jdp = jdp;
        inicialize();
    }

    public UiPanelTFServicioTransporte(String title, Main frame, JDesktopPane jdp, Usuario usuario, List<Boolean> vPermiso) {
        super(title, vPermiso.get(0), vPermiso.get(1), vPermiso.get(2), vPermiso.get(3), vPermiso.get(4), vPermiso.get(5), vPermiso.get(6), vPermiso.get(7), vPermiso.get(8), vPermiso.get(9), vPermiso.get(10), vPermiso.get(11), vPermiso.get(12));
        this.usuario = usuario;
        this.frame = frame;
        this.jdp = jdp;
        inicialize();
    }

    public UiPanelTFServicioTransporte(String title, Main frame, JDesktopPane jdp, Usuario usuario, boolean vendedor) {
        super(title + " - Panel Serv.Transporte", true, false, false, false, false, true, true, true, true, true, true, true, true);
        this.usuario = usuario;
        this.frame = frame;
        this.jdp = jdp;
        inicialize();
    }

    public UiPanelTFServicioTransporte(String title, Main frame, JDesktopPane jdp, Usuario usuario, boolean vendedor, boolean supervisor) {
        super(title + " - Panel Serv.Transporte", true, false, false, true, false, true, true, true, true, true, true, true, true);
        this.usuario = usuario;
        this.frame = frame;
        this.jdp = jdp;
        inicialize();
    }

    protected void inicialize() {
        modeltable = new ServicioTableModel();
        modeloOrdenado = new TableRowSorter<ServicioTableModel>(modeltable);
        table = new CTable();
        table.setRowSorter(modeloOrdenado);
        table.setModel(modeltable);
        table.setAllTableNoEditable();
        table.setAllColumnNoResizable();
        table.setRendererColumnZero();
        table.setAllColumnPreferredWidth();
        /*
         PopupMenuView popupmenu = new PopupMenuView();
         popupmenu.setControl(this);
         table.setComponentPopupMenu(popupmenu);
         */
        table.getSelectionModel().addListSelectionListener(this);
        scroll = new JScrollPane(table);

        table.addKeyListener(new KeyAdapter() {
            @Override
            public void keyReleased(KeyEvent e) {
                if (e.getKeyCode() == 127) {
                    //controlEliminate();
                } else {
                    e.getKeyCode();
                }
            }
        });

        table.addMouseListener(new MouseAdapter() {
            @Override
            public void mouseClicked(MouseEvent e) {
                if (e.getClickCount() == 2) {
                    controlDetails();
                }
            }
        });

        JPanel pnlaux = new JPanel();
        pnlaux.setLayout(new BorderLayout(0, 0));

        JPanel panel = getPanelFilter();
        panel.setPreferredSize(new Dimension(1200, 120));
        pnlaux.add(panel, BorderLayout.CENTER);

        scroll.setPreferredSize(new Dimension(1200, 350));
        pnlaux.add(scroll, BorderLayout.SOUTH);

        setTable(pnlaux);
    }

    protected JPanel getPanelFilter() {
        JPanel pnlp = new JPanel();
        pnlp.setBorder(new LineBorder(new Color(130, 135, 144)));
        pnlp.setLayout(null);

        JLabel lblCodigoDespacho = new JLabel("Id Serv.");
        lblCodigoDespacho.setBounds(10, 15, 55, 20);
        lblCodigoDespacho.setFont(new Font("Verdana", 0, 11));
        pnlp.add(lblCodigoDespacho);

        txt_idservicio = new JTextField();
        txt_idservicio.setBounds(75, 15, 90, 20);
        txt_idservicio.addKeyListener(this);
        txt_idservicio.addFocusListener(this);
        txt_idservicio.setFont(new Font("Garamond", 0, 14));
        pnlp.add(txt_idservicio);

        JLabel lblRazonSocial = new JLabel("Cliente");
        lblRazonSocial.setBounds(10, 45, 45, 20);
        pnlp.add(lblRazonSocial);

        txt_tmpanexo = new JTextField();
        txt_tmpanexo.setBounds(75, 45, 320, 20);
        txt_tmpanexo.addKeyListener(this);
        txt_tmpanexo.setDocument(new UpperCaseNumberDocument(250));
        txt_tmpanexo.addFocusListener(this);
        pnlp.add(txt_tmpanexo);

        JLabel lbl_RucCliente = new JLabel("RUC/DNI");
        lbl_RucCliente.setBounds(420, 45, 50, 20);
        pnlp.add(lbl_RucCliente);

        txt_tmpruc = new JTextField();
        txt_tmpruc.setBounds(470, 45, 80, 20);
        txt_tmpruc.addFocusListener(this);
        txt_tmpruc.addKeyListener(this);
        pnlp.add(txt_tmpruc);

        JLabel lblFechaInicio = new JLabel("F Inicio");
        lblFechaInicio.setDisplayedMnemonic('c');
        lblFechaInicio.setBounds(565, 45, 45, 20);
        pnlp.add(lblFechaInicio);

        dc_fechainicio = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        ((JTextField) dc_fechainicio.getDateEditor()).addFocusListener(this);
        dc_fechainicio.setBounds(610, 45, 90, 20);
        dc_fechainicio.getJCalendar().addMouseListener(this);
        dc_fechainicio.getJCalendar().addFocusListener(this);
        dc_fechainicio.getJCalendar().addKeyListener(this);
        dc_fechainicio.getCalendarButton().addMouseListener(this);
        dc_fechainicio.getCalendarButton().addActionListener(this);
        dc_fechainicio.addPropertyChangeListener(this);
        dc_fechainicio.addMouseListener(this);
        dc_fechainicio.addKeyListener(this);
        dc_fechainicio.addFocusListener(this);
        ((JTextField) dc_fechainicio.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                ((JTextFieldDateEditor) dc_fechafin.getDateEditor()).requestFocus();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        ((JTextField) dc_fechainicio.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dc_fechainicio.getCalendarButton().doClick();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_SPACE, 0, false), JComponent.WHEN_FOCUSED);

        pnlp.add(dc_fechainicio);

        JLabel lblFechaFin = new JLabel("F Fin");
        lblFechaFin.setBounds(710, 45, 30, 20);
        lblFechaFin.setDisplayedMnemonic('a');
        pnlp.add(lblFechaFin);

        dc_fechafin = new JDateChooser("dd/MM/yyyy", "##/##/####", '_');
        ((JTextField) dc_fechafin.getDateEditor()).addFocusListener(this);
        dc_fechafin.setBounds(740, 45, 90, 20);
        dc_fechafin.getJCalendar().addMouseListener(this);
        dc_fechafin.getJCalendar().addFocusListener(this);
        dc_fechafin.getJCalendar().addKeyListener(this);
        dc_fechafin.getCalendarButton().addMouseListener(this);
        dc_fechafin.getCalendarButton().addActionListener(this);
        dc_fechafin.addPropertyChangeListener(this);
        dc_fechafin.addMouseListener(this);
        dc_fechafin.addKeyListener(this);
        dc_fechafin.addFocusListener(this);
        ((JTextField) dc_fechafin.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {

            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_ENTER, 0, false), JComponent.WHEN_FOCUSED);
        ((JTextField) dc_fechafin.getDateEditor()).registerKeyboardAction(new ActionListener() {
            @Override
            public void actionPerformed(ActionEvent e) {
                dc_fechafin.getCalendarButton().doClick();
            }
        }, KeyStroke.getKeyStroke(KeyEvent.VK_SPACE, 0, false), JComponent.WHEN_FOCUSED);
        pnlp.add(dc_fechafin);

        JLabel lbl_idalmacen = new JLabel("Almacen");
        lbl_idalmacen.setFont(new Font("Verdana", 0, 11));
        lbl_idalmacen.setBounds(10, 75, 70, 20);
        pnlp.add(lbl_idalmacen);

        cbo_idalmacen = new JComboBox();
        cbo_idalmacen.setBounds(75, 75, 150, 20);
        cbo_idalmacen.setFont(new Font(Font.SANS_SERIF, 0, 9));
        cbo_idalmacen.addActionListener(this);
        cbo_idalmacen.addKeyListener(this);

        pnlp.add(cbo_idalmacen);
        return pnlp;
    }

    protected JDialog dialogo;
    JFrame frame1 = new JFrame();
    JComboBox cboSerieFact;
    JTextField txtPreimpresoFact;
    JButton btnGuardarFact;
    JButton btnCancelarFact;
    JDateChooser fechaFact;

    public JDialog mostrarFacturacion() {
        return null;
    }

    protected String getParametro() {
        return "";
    }

    @Override
    public void controlReport(boolean export) {
    }

    public void filtrar() {
    }

    public void setFecha(Date fechaInicio, Date fechaFin) {
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;

        dc_fechainicio.setSelectableDateRange(fechaInicio, fechaFin);
        dc_fechafin.setSelectableDateRange(fechaInicio, fechaFin);
        dc_fechainicio.setDate(fechaInicio);
        dc_fechafin.setDate(fechaFin);
    }

    @Override
    public void keyReleased(KeyEvent e) {
        if (e.getKeyChar() != '\n') {
            if ((e.getSource() == txt_idservicio)
                    || (e.getSource() == txt_tmpanexo)
                    || (e.getSource() == txt_tmpruc)) {
                filtrar();
            }
        }
    }

    public RowFilter<Object, Object> getFilter() {
        return null;
    }

    public void cargarFiltro() {
    }

    public void loadAlmacen() {
    }

    @Override
    public void focusGained(FocusEvent e) {
        if (e.getSource() == (JTextField) dc_fechainicio.getDateEditor()) {
            ((JTextField) dc_fechainicio.getDateEditor()).selectAll();
        }

        if (e.getSource() == (JTextField) dc_fechafin.getDateEditor()) {
            ((JTextField) dc_fechafin.getDateEditor()).selectAll();
        }

        if (e.getSource() == txt_idservicio) {
            txt_idservicio.selectAll();
        }

        if (e.getSource() == txt_tmpanexo) {
            txt_tmpanexo.selectAll();
        }

        if (e.getSource() == txt_tmpruc) {
            txt_tmpruc.selectAll();
        }

    }

    @Override
    public void actionPerformed(ActionEvent e) {
        if (e.getSource() == dc_fechainicio.getCalendarButton()) {
            dc_fechainicio.setSelectableDateRange(fechaInicio, dc_fechafin.getDate());
        }

        if (e.getSource() == dc_fechafin.getCalendarButton()) {
            dc_fechafin.setSelectableDateRange(dc_fechainicio.getDate(), fechaFin);
        }

        if (e.getSource() == cbo_idalmacen) {
            if (cbo_idalmacen.getItemCount() > 0) {
                if (cbo_idalmacen.getSelectedIndex() >= 0) {
                    filtrar();
                }
            }
        }
    }

    @Override
    public void controlPrint(boolean view) {
    }

    @Override
    public void controlAdd() {
    }

    @Override
    public void controlModify() {
    }

    @Override
    public void controlNullify() {
    }

    @Override
    public void controlEliminate() {
    }

    @Override
    public void controlDetails() {
    }

    @Override
    public void controlClone() {
    }

    @Override
    public void controlClose() {
    }

    @Override
    public void controlRefresh() {
    }

    @Override
    public Object getSelectedValue(int column) {
        return null;
    }

    @Override
    public void setSelectedRow(int row) {
        if (row >= 0) {
            table.setRowSelectionInterval(row, row);
            setScrollValueView(row);
        }
    }

    @Override
    public void valueChanged(ListSelectionEvent e) {
        if (!e.getValueIsAdjusting()) {
            refresh();
        }
    }

    @Override
    public int getSelectedRow() {
        return table.getSelectedRow();
    }

    @Override
    public void selectNextRow() {
        if (table.getRowCount() > 0) {
            if (table.getSelectedRow() < table.getRowCount() - 1) {
                int row = table.getSelectedRow() + 1;
                table.setRowSelectionInterval(row, row);
                setScrollValueView(row);
            }
        }
    }

    @Override
    public void selectPreviusRow() {
        if (table.getRowCount() > 0) {
            if (table.getSelectedRow() > 0) {
                int row = table.getSelectedRow() - 1;
                table.setRowSelectionInterval(row, row);
                setScrollValueView(row);
            }
        }
    }

    @Override
    public void selectLastRow() {
        if (table.getRowCount() > 0) {
            int rowCount = table.getRowCount() - 1;
            table.setRowSelectionInterval(rowCount, rowCount);
            setScrollValueView(rowCount);
        }
    }

    @Override
    public void selectFirstRow() {
        if (table.getRowCount() > 0) {
            table.setRowSelectionInterval(0, 0);
            setScrollValueView(0);
        }
    }

    public void setScrollValueView(int row) {
        scroll.getVerticalScrollBar().setValue(table.getRowHeight() * row);
    }

    @Override
    public int getRowCount() {
        return table.getRowCount();
    }

    public void cargarTabla() {
    }

    @Override
    public void focusLost(FocusEvent e) {
        if (e.getSource() == txt_idservicio && txt_idservicio.getText().trim().length() > 0) {
            String serie = "0000000000" + txt_idservicio.getText().trim();
            String nuevaserie = serie.substring(serie.length() - 10, serie.length());

            txt_idservicio.setText(nuevaserie);

            filtrar();
        }

    }

    @Override
    public void keyPressed(KeyEvent e) {
        if (e.getKeyChar() == '\n') {

            if (e.getSource() == txt_tmpanexo) {
                txt_tmpruc.requestFocus();
            }

            if (e.getSource() == txt_tmpruc) {
                ((JTextFieldDateEditor) dc_fechainicio.getDateEditor()).requestFocus();
            }
        }
    }

    @Override
    public void propertyChange(PropertyChangeEvent evt) {
        if ((evt.getSource() == dc_fechainicio)
                || (evt.getSource() == dc_fechafin)) {
            filtrar();
        }
    }

    @Override
    public void internalFrameClosing(InternalFrameEvent e) {
        jdp.updateUI();

        if (registeri == e.getSource()) {
            registeri.dispose();
            registeri = null;
        }

        jdp.updateUI();

        System.gc();
    }

    @Override
    public void controlSearch() {
    }

    @Override
    public void windowOpened(WindowEvent e) {
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
    public void keyTyped(KeyEvent e) {
    }

    @Override
    public void refreshTitleName() {
    }

    @Override
    public void setSelectedRow(String clave, int column) {
    }

    @Override
    public Object getSelectedValue(String column) {
        return null;
    }

    @Override
    public void setValueSearch(Object valor, Component comp) {
    }

    @Override
    public void selectFirstPage() {
    }

    @Override
    public void selectPreviusPage() {
    }

    @Override
    public void selectNextPage() {
    }

    @Override
    public void selectLastPage() {
    }

    @Override
    public int getSelectedPage() {
        return 0;
    }

    @Override
    public int getPageCount() {
        return 0;
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
    public void mouseEntered(MouseEvent e) {
    }

    @Override
    public void mouseExited(MouseEvent e) {
    }

    @Override
    public void itemStateChanged(ItemEvent e) {
    }
}
